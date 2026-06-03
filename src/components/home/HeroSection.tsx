export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-200/40 via-cream-50 to-cream-50" />
      {/* Decorative blur orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-48 h-48 bg-cream-200/40 rounded-full blur-3xl" />

      <div className="relative max-w-lg mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="text-5xl sm:text-6xl mb-6 animate-in">🦌</div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-wood tracking-[6px] mb-4">
          鹿呐烘焙
        </h1>
        <p className="text-sm text-gold tracking-[4px] mb-3 font-serif">
          LUNA BAKERY
        </p>
        <p className="text-wood-light text-sm leading-relaxed max-w-xs mx-auto">
          用鹿的灵韵，焙出生活的甜
        </p>
        <div className="mt-8">
          <a href="#featured" className="btn-primary inline-block">
            探索我们的产品
          </a>
        </div>
      </div>
    </section>
  );
}
