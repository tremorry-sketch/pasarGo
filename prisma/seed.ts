import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pasarku.id' },
    update: {},
    create: { name: 'Admin PasarKu', email: 'admin@pasarku.id', password: adminPassword, role: 'ADMIN', phone: '081234560000' },
  })

  // Market
  const market = await prisma.market.upsert({
    where: { slug: 'pasar-koja' },
    update: {},
    create: { name: 'Pasar Koja', slug: 'pasar-koja', address: 'Jl. Koja Raya No.1, Jakarta Utara', city: 'Jakarta' },
  })

  // Seller user
  const sellerPassword = await bcrypt.hash('seller123', 10)
  const seller = await prisma.user.upsert({
    where: { email: 'ibu.sari@pasarku.id' },
    update: {},
    create: { name: 'Ibu Sari', email: 'ibu.sari@pasarku.id', password: sellerPassword, role: 'SELLER', phone: '081234561111' },
  })

  // Seller shop
  const shop = await prisma.sellerShop.upsert({
    where: { slug: 'warung-sari-koja' },
    update: {},
    create: {
      userId: seller.id,
      marketId: market.id,
      name: 'Warung Sari',
      slug: 'warung-sari-koja',
      description: 'Sayur & buah segar pilihan langsung dari kebun',
      phone: '081234561111',
      isVerified: true,
      rating: 4.8,
    },
  })

  // Categories
  const categories = [
    { name: 'Sayuran', slug: 'sayuran', icon: '🥬' },
    { name: 'Buah', slug: 'buah', icon: '🍎' },
    { name: 'Ikan & Seafood', slug: 'ikan', icon: '🐟' },
    { name: 'Ayam & Daging', slug: 'ayam', icon: '🍗' },
    { name: 'Bumbu Dapur', slug: 'bumbu', icon: '🌶️' },
    { name: 'Sembako', slug: 'sembako', icon: '🌾' },
    { name: 'Telur', slug: 'telur', icon: '🥚' },
  ]

  const catMap: Record<string, string> = {}
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat },
    })
    catMap[cat.slug] = c.id
  }

  // Products
  const products = [
    { name: 'Bayam Segar', slug: 'bayam-segar', categorySlug: 'sayuran', price: 5000, unit: 'ikat', stock: 50 },
    { name: 'Kangkung', slug: 'kangkung', categorySlug: 'sayuran', price: 4000, unit: 'ikat', stock: 40 },
    { name: 'Wortel', slug: 'wortel', categorySlug: 'sayuran', price: 12000, unit: 'kg', stock: 20 },
    { name: 'Tomat Merah', slug: 'tomat-merah', categorySlug: 'sayuran', price: 15000, unit: 'kg', stock: 15 },
    { name: 'Pisang Ambon', slug: 'pisang-ambon', categorySlug: 'buah', price: 25000, unit: 'sisir', stock: 30 },
    { name: 'Pepaya Muda', slug: 'pepaya-muda', categorySlug: 'buah', price: 10000, unit: 'kg', stock: 20 },
    { name: 'Cabai Merah', slug: 'cabai-merah', categorySlug: 'bumbu', price: 40000, unit: 'kg', stock: 10 },
    { name: 'Bawang Merah', slug: 'bawang-merah', categorySlug: 'bumbu', price: 35000, unit: 'kg', stock: 15 },
    { name: 'Bawang Putih', slug: 'bawang-putih', categorySlug: 'bumbu', price: 30000, unit: 'kg', stock: 20 },
    { name: 'Ayam Kampung', slug: 'ayam-kampung', categorySlug: 'ayam', price: 65000, unit: 'kg', stock: 10 },
    { name: 'Ikan Bandeng', slug: 'ikan-bandeng', categorySlug: 'ikan', price: 35000, unit: 'kg', stock: 8 },
    { name: 'Telur Ayam', slug: 'telur-ayam', categorySlug: 'telur', price: 28000, unit: 'kg', stock: 50 },
    { name: 'Beras Premium', slug: 'beras-premium', categorySlug: 'sembako', price: 14000, unit: 'kg', stock: 100 },
    { name: 'Minyak Goreng', slug: 'minyak-goreng', categorySlug: 'sembako', price: 18000, unit: 'liter', stock: 30 },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { shopId_slug: { shopId: shop.id, slug: p.slug } },
      update: { price: p.price },
      create: {
        shopId: shop.id,
        categoryId: catMap[p.categorySlug],
        name: p.name,
        slug: p.slug,
        price: p.price,
        unit: p.unit,
        stock: p.stock,
        minOrder: 0.25,
      },
    })
  }

  // Buyer
  const buyerPassword = await bcrypt.hash('buyer123', 10)
  await prisma.user.upsert({
    where: { email: 'pembeli@pasarku.id' },
    update: {},
    create: {
      name: 'Ibu Dewi',
      email: 'pembeli@pasarku.id',
      password: buyerPassword,
      role: 'BUYER',
      phone: '081234562222',
      address: 'Jl. Pahlawan No.5, Jakarta Utara',
    },
  })

  // Courier
  const courierPassword = await bcrypt.hash('kurir123', 10)
  await prisma.user.upsert({
    where: { email: 'kurir@pasarku.id' },
    update: {},
    create: {
      name: 'Budi Kurir',
      email: 'kurir@pasarku.id',
      password: courierPassword,
      role: 'COURIER',
      phone: '081234563333',
    },
  })

  console.log('✅ Seeding selesai!')
  console.log('')
  console.log('Akun demo:')
  console.log('  Admin  : admin@pasarku.id / admin123')
  console.log('  Penjual: ibu.sari@pasarku.id / seller123')
  console.log('  Pembeli: pembeli@pasarku.id / buyer123')
  console.log('  Kurir  : kurir@pasarku.id / kurir123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
