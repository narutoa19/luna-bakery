import Link from "next/link";

export function EmptyCart() {
  return (
    <div className="text-center py-20">
      <div className="text-5xl mb-6">🛒</div>
      <h2 className="font-serif text-lg text-wood tracking-[2px] mb-2">购物车是空的</h2>
      <p className="text-xs text-wood-light mb-6">快去挑选喜欢的产品吧~</p>
      <Link href="/" className="btn-primary inline-block">
        去逛逛
      </Link>
    </div>
  );
}
