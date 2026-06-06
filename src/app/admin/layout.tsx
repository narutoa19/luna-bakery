"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "📊 仪表盘" },
  { href: "/admin/products", label: "🍰 产品管理" },
  { href: "/admin/orders", label: "📋 订单管理" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authFailed, setAuthFailed] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("luna-admin-token");
    if (!token) {
      setAuthFailed(true);
      setLoading(false);
    } else {
      setAuthed(true);
      setLoading(false);
    }
  }, [isLoginPage]);

  const handleLogout = () => {
    localStorage.removeItem("luna-admin-token");
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="text-gold text-sm">加载中...</div>
      </div>
    );
  }

  if (authFailed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-sm text-wood mb-6">请先登录管理后台</p>
          <Link href="/admin/login" className="btn-primary inline-block">
            前往登录
          </Link>
        </div>
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="bg-white border-b border-gold-light/30 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🦌</span>
            <span className="text-sm font-serif font-bold text-wood tracking-[2px]">管理后台</span>
          </div>
          <button onClick={handleLogout} className="text-xs text-wood-light hover:text-wood">
            退出
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <nav className="flex gap-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 text-center py-2 rounded-md text-xs transition-colors",
                pathname === item.href
                  ? "bg-wood text-cream-50"
                  : "text-wood-light hover:bg-cream-100"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {children}
      </div>
    </div>
  );
}
