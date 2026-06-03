"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/checkout/ContactForm";
import { NotesInput } from "@/components/checkout/NotesInput";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { SuccessView } from "@/components/checkout/SuccessView";
import { EmptyCart } from "@/components/cart/EmptyCart";

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ phone?: string; name?: string }>({});

  if (items.length === 0 && !submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <EmptyCart />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto">
        <SuccessView orderId={orderId} totalAmount={totalAmount} />
      </div>
    );
  }

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!phone.trim() || !/^1[3-9]\d{9}$/.test(phone.trim())) {
      errs.phone = "请输入正确的手机号";
    }
    if (!name.trim()) {
      errs.name = "请输入称呼";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          notes: notes.trim(),
          items: items.map((i) => ({
            product_id: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
            size: i.size,
          })),
          total_amount: totalAmount,
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      const data = await res.json();
      setOrderId(data.id);
      clearCart();
      setSubmitted(true);
    } catch {
      alert("提交失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/cart" className="text-xs text-wood-light hover:text-wood">← 返回</Link>
        <h1 className="font-serif text-lg font-bold text-wood tracking-[2px]">确认订单</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <ContactForm
          phone={phone}
          name={name}
          onPhoneChange={setPhone}
          onNameChange={setName}
          errors={errors}
        />
        <NotesInput value={notes} onChange={setNotes} />
        <OrderSummary />
        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? "提交中..." : "提交订单"}
        </Button>
      </form>
    </div>
  );
}
