export function Footer() {
  return (
    <footer className="bg-wood text-cream-100 py-10 mt-auto">
      <div className="max-w-lg mx-auto px-4 text-center">
        <div className="text-3xl mb-3" aria-hidden="true">🦌</div>
        <p className="font-serif text-lg tracking-[4px] mb-2">鹿呐烘焙</p>
        <p className="text-xs text-cream-200/60 mb-6">用鹿的灵韵，焙出生活的甜</p>
        <div className="flex justify-center gap-6 text-xs text-cream-200/50 mb-4">
          <span>📍 地址待填写</span>
          <span>📞 电话待填写</span>
        </div>
        <p className="text-[10px] text-cream-200/30">
          © 2026 鹿呐烘焙 All rights reserved.
        </p>
      </div>
    </footer>
  );
}
