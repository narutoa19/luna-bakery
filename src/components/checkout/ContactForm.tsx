"use client";
import { Input } from "@/components/ui/Input";

interface Props {
  phone: string;
  name: string;
  onPhoneChange: (v: string) => void;
  onNameChange: (v: string) => void;
  errors: { phone?: string; name?: string };
}

export function ContactForm({ phone, name, onPhoneChange, onNameChange, errors }: Props) {
  return (
    <div className="card p-4 space-y-3">
      <h3 className="text-xs text-wood font-semibold tracking-wider">📱 联系信息</h3>
      <Input
        label="手机号"
        type="tel"
        placeholder="输入手机号"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        error={errors.phone}
      />
      <Input
        label="称呼"
        placeholder="如何称呼您？"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        error={errors.name}
      />
    </div>
  );
}
