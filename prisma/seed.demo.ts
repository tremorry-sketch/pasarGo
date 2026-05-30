// @ts-nocheck
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const DEMO_IDS = {
  admin:    'demo-admin-001',
  seller1:  'demo-seller-001',
  seller2:  'demo-seller-002',
  seller3:  'demo-seller-003',
  buyer1:   'demo-buyer-001',
  buyer2:   'demo-buyer-002',
  courier1: 'demo-courier-001',
  courier2: 'demo-courier-002',
}

async function main() {
  console.log('🌱 Seeding demo data...')

  const pw = await bcrypt.hash('demo123', 10)

  // ─── Users ───────────────────────────────────────────────
  await prisma.user.upsert({
    where: { id: DEMO_IDS.admin },
    update: {},
    create: {
      id: DEMO_IDS.admin, name: 'Admin PasarGo', email: 'admin@pasarku.id',
      password: pw, role: 'ADMIN', phone: '081200000000',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  })

  await prisma.user.upsert({
    where: { id: DEMO_IDS.seller1 },
    update: {},
    create: {
      id: DEMO_IDS.seller1, name: 'Ibu Sari', email: 'ibu.sari@pasarku.id',
      password: pw, role: 'SELLER', phone: '081211111111',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sari',
    },
  })

  await prisma.user.upsert({
    where: { id: DEMO_IDS.seller2 },
    update: {},
    create: {
      id: DEMO_IDS.seller2, name: 'Pak Budi', email: 'pak.budi@pasarku.id',
      password: pw, role: 'SELLER', phone: '081222222222',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=budi',
    },
  })

  await prisma.user.upsert({
    where: { id: DEMO_IDS.seller3 },
    update: {},
    create: {
      id: DEMO_IDS.seller3, name: 'Ibu Dewi', email: 'ibu.dewi@pasarku.id',
      password: pw, role: 'SELLER', phone: '081233333333',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dewi',
    },
  })

  await prisma.user.upsert({
    where: { id: DEMO_IDS.buyer1 },
    update: {},
    create: {
      id: DEMO_IDS.buyer1, name: 'Andi Pratama', email: 'pembeli@pasarku.id',
      password: pw, role: 'BUYER', phone: '081244444444',
      address: 'Jl. Merdeka No. 10, Jakarta Utara',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=andi',
    },
  })

  await prisma.user.upsert({
    where: { id: DEMO_IDS.buyer2 },
    update: {},
    create: {
      id: DEMO_IDS.buyer2, name: 'Rani Putri', email: 'rani@pasarku.id',
      password: pw, role: 'BUYER', phone: '081255555555',
      address: 'Jl. Kenanga No. 5, Jakarta Utara',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rani',
    },
  })

  await prisma.user.upsert({
    where: { id: DEMO_IDS.courier1 },
    update: {},
    create: {
      id: DEMO_IDS.courier1, name: 'Rizki Kurir', email: 'kurir@pasarku.id',
      password: pw, role: 'COURIER', phone: '081266666666',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rizki',
    },
  })

  await prisma.user.upsert({
    where: { id: DEMO_IDS.courier2 },
    update: {},
    create: {
      id: DEMO_IDS.courier2, name: 'Doni Antar', email: 'kurir2@pasarku.id',
      password: pw, role: 'COURIER', phone: '081277777777',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=doni',
    },
  })

  // ─── Markets ──────────────────────────────────────────────
  const marketKoja = await prisma.market.upsert({
    where: { slug: 'pasar-koja' },
    update: {},
    create: {
      name: 'Pasar Koja', slug: 'pasar-koja',
      address: 'Jl. Raya Koja No. 1, Jakarta Utara',
      city: 'Jakarta Utara',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    },
  })

  const marketSenen = await prisma.market.upsert({
    where: { slug: 'pasar-senen' },
    update: {},
    create: {
      name: 'Pasar Senen', slug: 'pasar-senen',
      address: 'Jl. Pasar Senen No. 2, Jakarta Pusat',
      city: 'Jakarta Pusat',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    },
  })

  // ─── Categories ───────────────────────────────────────────
  const cats = await Promise.all([
    prisma.category.upsert({ where: { slug: 'sayuran' }, update: {}, create: { name: 'Sayuran', slug: 'sayuran', icon: '🥬', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' } }),
    prisma.category.upsert({ where: { slug: 'buah' }, update: {}, create: { name: 'Buah-buahan', slug: 'buah', icon: '🍎', imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80' } }),
    prisma.category.upsert({ where: { slug: 'daging' }, update: {}, create: { name: 'Daging & Ayam', slug: 'daging', icon: '🥩', imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80' } }),
    prisma.category.upsert({ where: { slug: 'ikan' }, update: {}, create: { name: 'Ikan & Seafood', slug: 'ikan', icon: '🐟', imageUrl: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&q=80' } }),
    prisma.category.upsert({ where: { slug: 'bumbu' }, update: {}, create: { name: 'Bumbu & Rempah', slug: 'bumbu', icon: '🌶️', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80' } }),
    prisma.category.upsert({ where: { slug: 'telur-susu' }, update: {}, create: { name: 'Telur & Susu', slug: 'telur-susu', icon: '🥚', imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80' } }),
    prisma.category.upsert({ where: { slug: 'beras-kering' }, update: {}, create: { name: 'Beras & Kering', slug: 'beras-kering', icon: '🌾', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80' } }),
    prisma.category.upsert({ where: { slug: 'jajanan' }, update: {}, create: { name: 'Jajanan Pasar', slug: 'jajanan', icon: '🍡', imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80' } }),
  ])

  const [catSayur, catBuah, catDaging, catIkan, catBumbu, catTelur, catBeras, catJajan] = cats

  // ─── Shops ────────────────────────────────────────────────
  const shop1 = await prisma.sellerShop.upsert({
    where: { slug: 'sayuran-bu-sari' },
    update: {},
    create: {
      userId: DEMO_IDS.seller1, marketId: marketKoja.id,
      name: 'Sayuran Bu Sari', slug: 'sayuran-bu-sari',
      description: 'Sayuran segar langsung dari petani, dipilih setiap pagi.',
      imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80',
      phone: '081211111111', isVerified: true, rating: 4.8, totalOrders: 312,
    },
  })

  const shop2 = await prisma.sellerShop.upsert({
    where: { slug: 'ikan-pak-budi' },
    update: {},
    create: {
      userId: DEMO_IDS.seller2, marketId: marketKoja.id,
      name: 'Ikan Segar Pak Budi', slug: 'ikan-pak-budi',
      description: 'Ikan dan seafood segar setiap hari dari Muara Baru.',
      imageUrl: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&q=80',
      phone: '081222222222', isVerified: true, rating: 4.6, totalOrders: 218,
    },
  })

  const shop3 = await prisma.sellerShop.upsert({
    where: { slug: 'bumbu-ibu-dewi' },
    update: {},
    create: {
      userId: DEMO_IDS.seller3, marketId: marketSenen.id,
      name: 'Bumbu Lengkap Bu Dewi', slug: 'bumbu-ibu-dewi',
      description: 'Bumbu dan rempah segar siap masak.',
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80',
      phone: '081233333333', isVerified: true, rating: 4.9, totalOrders: 445,
    },
  })

  // ─── Products ─────────────────────────────────────────────
  const makeSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const products1 = [
    { name: 'Bayam Hijau Segar', price: 5000, unit: 'ikat', stock: 50, categoryId: catSayur.id, imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80', description: 'Bayam hijau segar petik pagi, kaya zat besi.' },
    { name: 'Wortel Lokal', price: 8000, unit: 'kg', stock: 30, categoryId: catSayur.id, imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80', description: 'Wortel oranye manis dari Jawa Barat.' },
    { name: 'Tomat Merah', price: 12000, unit: 'kg', stock: 25, categoryId: catSayur.id, imageUrl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80', description: 'Tomat merah segar, cocok untuk masak dan jus.' },
    { name: 'Kangkung Segar', price: 4000, unit: 'ikat', stock: 40, categoryId: catSayur.id, imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80', description: 'Kangkung segar dipetik tiap pagi.' },
    { name: 'Buncis Muda', price: 10000, unit: 'kg', stock: 20, categoryId: catSayur.id, imageUrl: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=400&q=80', description: 'Buncis muda renyah dan segar.' },
    { name: 'Timun Jepang', price: 7000, unit: 'kg', stock: 35, categoryId: catSayur.id, imageUrl: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&q=80', description: 'Timun jepang segar, cocok untuk lalapan.' },
    { name: 'Pisang Kepok', price: 15000, unit: 'sisir', stock: 20, categoryId: catBuah.id, imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80', description: 'Pisang kepok manis, bagus untuk digoreng.' },
    { name: 'Pepaya California', price: 12000, unit: 'kg', stock: 15, categoryId: catBuah.id, imageUrl: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400&q=80', description: 'Pepaya california manis dan lembut.' },
    { name: 'Telur Ayam Kampung', price: 35000, unit: 'kg', stock: 100, categoryId: catTelur.id, imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80', description: 'Telur ayam kampung asli, kuning telur orange.' },
    { name: 'Beras Premium IR64', price: 65000, unit: 'kg', stock: 200, categoryId: catBeras.id, imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80', description: 'Beras premium pulen cocok untuk nasi sehari-hari.' },
  ]

  for (const p of products1) {
    const slug = makeSlug(p.name)
    await prisma.product.upsert({
      where: { shopId_slug: { shopId: shop1.id, slug } },
      update: {},
      create: { ...p, shopId: shop1.id, slug, minOrder: 0.5 },
    })
  }

  const products2 = [
    { name: 'Ikan Nila Segar', price: 28000, unit: 'kg', stock: 20, categoryId: catIkan.id, imageUrl: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&q=80', description: 'Ikan nila segar dari kolam lokal.' },
    { name: 'Udang Vaname', price: 75000, unit: 'kg', stock: 15, categoryId: catIkan.id, imageUrl: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?w=400&q=80', description: 'Udang vaname segar ukuran sedang.' },
    { name: 'Ikan Bandeng Presto', price: 45000, unit: 'kg', stock: 10, categoryId: catIkan.id, imageUrl: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=400&q=80', description: 'Bandeng presto siap masak, tanpa duri.' },
    { name: 'Cumi-cumi Segar', price: 55000, unit: 'kg', stock: 12, categoryId: catIkan.id, imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&q=80', description: 'Cumi-cumi segar dari laut utara Jawa.' },
    { name: 'Ayam Potong Kampung', price: 38000, unit: 'kg', stock: 25, categoryId: catDaging.id, imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80', description: 'Ayam kampung potong segar, dipotong saat dipesan.' },
    { name: 'Daging Sapi Rendang', price: 130000, unit: 'kg', stock: 8, categoryId: catDaging.id, imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80', description: 'Daging sapi pilihan untuk rendang.' },
  ]

  for (const p of products2) {
    const slug = makeSlug(p.name)
    await prisma.product.upsert({
      where: { shopId_slug: { shopId: shop2.id, slug } },
      update: {},
      create: { ...p, shopId: shop2.id, slug, minOrder: 0.5 },
    })
  }

  const products3 = [
    { name: 'Bawang Merah Brebes', price: 35000, unit: 'kg', stock: 50, categoryId: catBumbu.id, imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80', description: 'Bawang merah Brebes asli, harum dan tajam.' },
    { name: 'Bawang Putih Lokal', price: 30000, unit: 'kg', stock: 45, categoryId: catBumbu.id, imageUrl: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&q=80', description: 'Bawang putih lokal segar.' },
    { name: 'Cabai Merah Keriting', price: 45000, unit: 'kg', stock: 20, categoryId: catBumbu.id, imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&q=80', description: 'Cabai merah keriting pedas segar.' },
    { name: 'Cabai Rawit Hijau', price: 40000, unit: 'kg', stock: 18, categoryId: catBumbu.id, imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80', description: 'Cabai rawit hijau super pedas.' },
    { name: 'Jahe Emprit', price: 20000, unit: 'kg', stock: 30, categoryId: catBumbu.id, imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80', description: 'Jahe emprit segar, harum dan pedas.' },
    { name: 'Kunyit Segar', price: 15000, unit: 'kg', stock: 25, categoryId: catBumbu.id, imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80', description: 'Kunyit segar untuk masak dan kesehatan.' },
    { name: 'Kemiri Kupas', price: 50000, unit: 'kg', stock: 15, categoryId: catBumbu.id, imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80', description: 'Kemiri kupas siap haluskan.' },
  ]

  for (const p of products3) {
    const slug = makeSlug(p.name)
    await prisma.product.upsert({
      where: { shopId_slug: { shopId: shop3.id, slug } },
      update: {},
      create: { ...p, shopId: shop3.id, slug, minOrder: 0.25 },
    })
  }

  // ─── Sample Orders ────────────────────────────────────────
  const allProducts1 = await prisma.product.findMany({ where: { shopId: shop1.id }, take: 3 })
  const allProducts2 = await prisma.product.findMany({ where: { shopId: shop2.id }, take: 2 })

  // Order 1: PACKING
  const order1 = await prisma.order.upsert({
    where: { orderNumber: 'ORD-DEMO-001' },
    update: {},
    create: {
      orderNumber: 'ORD-DEMO-001',
      buyerId: DEMO_IDS.buyer1, shopId: shop1.id,
      status: 'PACKING',
      subtotal: allProducts1.reduce((a, p) => a + p.price, 0),
      deliveryFee: 15000,
      total: allProducts1.reduce((a, p) => a + p.price, 0) + 15000,
      deliveryAddress: 'Jl. Merdeka No. 10, Jakarta Utara',
      buyerNote: 'Tolong pilihkan yang segar ya',
      ifStockEmpty: 'CONTACT',
      paymentMethod: 'COD',
    },
  })

  for (const p of allProducts1) {
    await prisma.orderItem.upsert({
      where: { id: `item-demo-001-${p.id}` },
      update: {},
      create: {
        id: `item-demo-001-${p.id}`,
        orderId: order1.id, productId: p.id,
        productName: p.name, productUnit: p.unit,
        quantity: 1, priceAtOrder: p.price,
      },
    })
  }

  // Order 2: PLACED (baru masuk)
  const order2 = await prisma.order.upsert({
    where: { orderNumber: 'ORD-DEMO-002' },
    update: {},
    create: {
      orderNumber: 'ORD-DEMO-002',
      buyerId: DEMO_IDS.buyer2, shopId: shop2.id,
      status: 'PLACED',
      subtotal: allProducts2.reduce((a, p) => a + p.price, 0),
      deliveryFee: 15000,
      total: allProducts2.reduce((a, p) => a + p.price, 0) + 15000,
      deliveryAddress: 'Jl. Kenanga No. 5, Jakarta Utara',
      ifStockEmpty: 'REPLACE',
      paymentMethod: 'COD',
    },
  })

  for (const p of allProducts2) {
    await prisma.orderItem.upsert({
      where: { id: `item-demo-002-${p.id}` },
      update: {},
      create: {
        id: `item-demo-002-${p.id}`,
        orderId: order2.id, productId: p.id,
        productName: p.name, productUnit: p.unit,
        quantity: 1, priceAtOrder: p.price,
      },
    })
  }

  // Order 3: READY_FOR_PICKUP → Delivery AVAILABLE
  const order3 = await prisma.order.upsert({
    where: { orderNumber: 'ORD-DEMO-003' },
    update: {},
    create: {
      orderNumber: 'ORD-DEMO-003',
      buyerId: DEMO_IDS.buyer1, shopId: shop1.id,
      status: 'READY_FOR_PICKUP',
      subtotal: 25000,
      deliveryFee: 15000,
      total: 40000,
      deliveryAddress: 'Jl. Merdeka No. 10, Jakarta Utara',
      ifStockEmpty: 'CONTACT',
      paymentMethod: 'COD',
    },
  })

  await prisma.orderItem.upsert({
    where: { id: 'item-demo-003-a' },
    update: {},
    create: {
      id: 'item-demo-003-a',
      orderId: order3.id, productId: allProducts1[0].id,
      productName: allProducts1[0].name, productUnit: allProducts1[0].unit,
      quantity: 2, priceAtOrder: allProducts1[0].price,
    },
  })

  await prisma.delivery.upsert({
    where: { orderId: order3.id },
    update: {},
    create: {
      orderId: order3.id,
      status: 'AVAILABLE',
      pickupAddress: `${shop1.name} - ${marketKoja.name}, ${marketKoja.address}`,
      dropAddress: 'Jl. Merdeka No. 10, Jakarta Utara',
    },
  })

  // Order 4: ON_DELIVERY oleh kurir 1
  const order4 = await prisma.order.upsert({
    where: { orderNumber: 'ORD-DEMO-004' },
    update: {},
    create: {
      orderNumber: 'ORD-DEMO-004',
      buyerId: DEMO_IDS.buyer2, shopId: shop3.id,
      status: 'ON_DELIVERY',
      subtotal: 80000,
      deliveryFee: 15000,
      total: 95000,
      deliveryAddress: 'Jl. Kenanga No. 5, Jakarta Utara',
      ifStockEmpty: 'CONTACT',
      paymentMethod: 'COD',
    },
  })

  await prisma.orderItem.upsert({
    where: { id: 'item-demo-004-a' },
    update: {},
    create: {
      id: 'item-demo-004-a',
      orderId: order4.id, productId: (await prisma.product.findFirst({ where: { shopId: shop3.id } }))!.id,
      productName: 'Bawang Merah Brebes', productUnit: 'kg',
      quantity: 2, priceAtOrder: 35000,
    },
  })

  await prisma.delivery.upsert({
    where: { orderId: order4.id },
    update: {},
    create: {
      orderId: order4.id,
      courierId: DEMO_IDS.courier1,
      status: 'ON_DELIVERY',
      pickupAddress: `${shop3.name} - ${marketSenen.name}, ${marketSenen.address}`,
      dropAddress: 'Jl. Kenanga No. 5, Jakarta Utara',
      acceptedAt: new Date(Date.now() - 30 * 60000),
      pickedUpAt: new Date(Date.now() - 15 * 60000),
    },
  })

  // Order 5: DELIVERED (history)
  const order5 = await prisma.order.upsert({
    where: { orderNumber: 'ORD-DEMO-005' },
    update: {},
    create: {
      orderNumber: 'ORD-DEMO-005',
      buyerId: DEMO_IDS.buyer1, shopId: shop2.id,
      status: 'DELIVERED',
      subtotal: 56000,
      deliveryFee: 15000,
      total: 71000,
      deliveryAddress: 'Jl. Merdeka No. 10, Jakarta Utara',
      ifStockEmpty: 'CONTACT',
      paymentMethod: 'COD',
    },
  })

  await prisma.orderItem.upsert({
    where: { id: 'item-demo-005-a' },
    update: {},
    create: {
      id: 'item-demo-005-a',
      orderId: order5.id, productId: allProducts2[0].id,
      productName: allProducts2[0].name, productUnit: allProducts2[0].unit,
      quantity: 2, priceAtOrder: allProducts2[0].price,
    },
  })

  await prisma.delivery.upsert({
    where: { orderId: order5.id },
    update: {},
    create: {
      orderId: order5.id,
      courierId: DEMO_IDS.courier2,
      status: 'DELIVERED',
      pickupAddress: `${shop2.name} - ${marketKoja.name}, ${marketKoja.address}`,
      dropAddress: 'Jl. Merdeka No. 10, Jakarta Utara',
      acceptedAt: new Date(Date.now() - 3 * 3600000),
      pickedUpAt: new Date(Date.now() - 2.5 * 3600000),
      deliveredAt: new Date(Date.now() - 2 * 3600000),
    },
  })

  console.log('✅ Demo seed selesai!')
  console.log('\nAkun demo (semua password: demo123):')
  console.log('  Admin  : admin@pasarku.id')
  console.log('  Penjual: ibu.sari@pasarku.id / pak.budi@pasarku.id / ibu.dewi@pasarku.id')
  console.log('  Pembeli: pembeli@pasarku.id / rani@pasarku.id')
  console.log('  Kurir  : kurir@pasarku.id / kurir2@pasarku.id')
}

main().catch(console.error).finally(() => prisma.$disconnect())
