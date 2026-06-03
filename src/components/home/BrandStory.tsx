export function BrandStory() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-lg mx-auto text-center">
        <div className="text-2xl mb-4">🌿</div>
        <h2 className="font-serif text-2xl text-wood tracking-[3px] mb-6">我们的故事</h2>
        <p className="text-wood-light text-sm leading-loose max-w-sm mx-auto">
          鹿呐烘焙，诞生于对自然的敬畏与对甜点的热爱。
          我们相信，每一份甜点都应该是大自然的馈赠——
          选用当季鲜果、进口乳制品、天然原料，
          用匠人的双手，焙出温暖人心的味道。
        </p>
        <div className="mt-8 flex justify-center gap-8 text-center">
          <div>
            <div className="font-serif text-2xl text-gold font-bold">100%</div>
            <div className="text-xs text-wood-light mt-1">天然原料</div>
          </div>
          <div className="w-px bg-gold-light/50" />
          <div>
            <div className="font-serif text-2xl text-gold font-bold">当日</div>
            <div className="text-xs text-wood-light mt-1">新鲜现做</div>
          </div>
          <div className="w-px bg-gold-light/50" />
          <div>
            <div className="font-serif text-2xl text-gold font-bold">0</div>
            <div className="text-xs text-wood-light mt-1">添加剂</div>
          </div>
        </div>
      </div>
    </section>
  );
}
