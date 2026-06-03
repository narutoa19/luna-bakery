"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("密码错误");
        return;
      }

      const { token } = await res.json();
      localStorage.setItem("luna-admin-token", token);
      router.push("/admin");
    } catch {
      setError("登录失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🦌</div>
          <h1 className="font-serif text-xl font-bold text-wood tracking-[4px]">鹿呐烘焙</h1>
          <p className="text-xs text-gold tracking-[2px] mt-1">管理后台</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field text-center"
              autoFocus
            />
            {error && <p className="text-xs text-red-500 text-center mt-2">{error}</p>}
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "验证中..." : "进入后台"}
          </Button>
          <p className="text-[10px] text-gold text-center">密码登录，简单安全</p>
        </form>
      </div>
    </div>
  );
}
