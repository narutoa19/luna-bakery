import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">&#x1F98C;</div>
      <h1 className="font-serif text-2xl text-wood tracking-[3px] mb-2">404</h1>
      <p className="text-sm text-wood-light mb-8">页面不存在，可能已经被吃掉啦~</p>
      <Link href="/" className="btn-primary inline-block">
        返回首页
      </Link>
    </div>
  );
}
