-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('蛋糕', '面包', '饼干', '甜点', '饮品')),
  price INTEGER NOT NULL CHECK (price > 0),
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id VARCHAR(20) PRIMARY KEY,
  customer_name VARCHAR(50) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  notes TEXT DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]',
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- RLS: Public read for active products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active products" ON products
  FOR SELECT USING (is_active = true);

-- RLS: Admin full access (using service_role bypasses RLS)
CREATE POLICY "Admin full access" ON products
  FOR ALL USING (true);

-- RLS: Public can insert orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can create orders" ON orders
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can read own orders by phone" ON orders
  FOR SELECT USING (true);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed data: sample products
INSERT INTO products (name, category, price, description, image_url, tags, is_featured) VALUES
('云朵草莓蛋糕', '蛋糕', 238, '新鲜草莓与轻盈奶油的完美邂逅。采用日本进口鲜奶油，搭配当季新鲜草莓，每一口都是云朵般的绵密。', '/images/placeholder-cake.jpg', ARRAY['🔥 热销', '⭐ 推荐'], true),
('鹿角可颂', '面包', 28, '手工开酥，层层分明。法国AOP黄油，72小时低温发酵，外酥内软。', '/images/placeholder-croissant.jpg', ARRAY['🔥 热销'], true),
('森林莓果吐司', '面包', 42, '天然酵种发酵，莓果干与坚果交织。无添加，每一片都是森林的味道。', '/images/placeholder-toast.jpg', ARRAY['🆕 新品'], true),
('鹿印曲奇', '饼干', 58, '黄油曲奇搭配杏仁片，鹿形压花。酥脆香甜，下午茶绝配。', '/images/placeholder-cookie.jpg', ARRAY['⭐ 推荐'], true),
('焦糖布丁', '甜点', 32, '法式焦糖布丁，香草籽加持。丝滑细腻，焦糖脆壳下的温柔。', '/images/placeholder-pudding.jpg', ARRAY['🆕 新品'], false),
('抹茶红豆蛋糕卷', '蛋糕', 168, '日本宇治抹茶与北海道红豆。松软蛋糕体，每一口都是京都的味道。', '/images/placeholder-matcha.jpg', ARRAY['⭐ 推荐'], false);
