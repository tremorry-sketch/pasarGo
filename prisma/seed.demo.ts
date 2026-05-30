// @ts-nocheck
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

async function main() {
  console.log('🌱 Seeding demo data...')
  const pw = await bcrypt.hash('demo123', 10)

  // ── Users ────────────────────────────────────────────────────────────────
  const users = [
    { id: 'demo-admin-001',    name: 'Admin PasarGo',   email: 'admin@pasarku.id',       role: 'ADMIN',   phone: '081200000000' },
    { id: 'demo-seller-001',   name: 'Ibu Sari',        email: 'ibu.sari@pasarku.id',    role: 'SELLER',  phone: '081211111111' },
    { id: 'demo-seller-002',   name: 'Pak Budi',        email: 'pak.budi@pasarku.id',    role: 'SELLER',  phone: '081222222222' },
    { id: 'demo-seller-003',   name: 'Ibu Dewi',        email: 'ibu.dewi@pasarku.id',    role: 'SELLER',  phone: '081233333333' },
    { id: 'demo-seller-004',   name: 'Pak Hendra',      email: 'pak.hendra@pasarku.id',  role: 'SELLER',  phone: '081244444441' },
    { id: 'demo-seller-005',   name: 'Ibu Rina',        email: 'ibu.rina@pasarku.id',    role: 'SELLER',  phone: '081255555551' },
    { id: 'demo-seller-006',   name: 'Pak Agus',        email: 'pak.agus@pasarku.id',    role: 'SELLER',  phone: '081266666661' },
    { id: 'demo-seller-007',   name: 'Ibu Tuti',        email: 'ibu.tuti@pasarku.id',    role: 'SELLER',  phone: '081277777771' },
    { id: 'demo-seller-008',   name: 'Pak Joko',        email: 'pak.joko@pasarku.id',    role: 'SELLER',  phone: '081288888881' },
    { id: 'demo-seller-009',   name: 'Ibu Ani',         email: 'ibu.ani@pasarku.id',     role: 'SELLER',  phone: '081299999991' },
    { id: 'demo-seller-010',   name: 'Pak Wahyu',       email: 'pak.wahyu@pasarku.id',   role: 'SELLER',  phone: '081211111112' },
    { id: 'demo-seller-011',   name: 'Ibu Lestari',     email: 'ibu.lestari@pasarku.id', role: 'SELLER',  phone: '081222222223' },
    { id: 'demo-seller-012',   name: 'Pak Doni',        email: 'pak.doni@pasarku.id',    role: 'SELLER',  phone: '081233333334' },
    { id: 'demo-buyer-001',    name: 'Andi Pratama',    email: 'pembeli@pasarku.id',     role: 'BUYER',   phone: '081244444444', address: 'Jl. Merdeka No. 10, Jakarta Utara' },
    { id: 'demo-buyer-002',    name: 'Rani Putri',      email: 'rani@pasarku.id',        role: 'BUYER',   phone: '081255555555', address: 'Jl. Kenanga No. 5, Jakarta Utara' },
    { id: 'demo-buyer-003',    name: 'Budi Santoso',    email: 'budi.s@pasarku.id',      role: 'BUYER',   phone: '081266666666', address: 'Jl. Melati No. 3, Jakarta Barat' },
    { id: 'demo-courier-001',  name: 'Rizki Kurir',     email: 'kurir@pasarku.id',       role: 'COURIER', phone: '081277777777' },
    { id: 'demo-courier-002',  name: 'Doni Antar',      email: 'kurir2@pasarku.id',      role: 'COURIER', phone: '081288888888' },
  ]

  for (const u of users) {
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: { ...u, password: pw, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}` },
    })
  }

  // ── Markets ──────────────────────────────────────────────────────────────
  const markets = [
    { name: 'Pasar Koja',        slug: 'pasar-koja',        address: 'Jl. Raya Koja No. 1, Jakarta Utara',   city: 'Jakarta Utara',  imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80' },
    { name: 'Pasar Senen',       slug: 'pasar-senen',       address: 'Jl. Pasar Senen No. 2, Jakarta Pusat', city: 'Jakarta Pusat',  imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80' },
    { name: 'Pasar Santa',       slug: 'pasar-santa',       address: 'Jl. Cipaku I No. 1, Jakarta Selatan',  city: 'Jakarta Selatan',imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&q=80' },
    { name: 'Pasar Tanah Abang', slug: 'pasar-tanah-abang', address: 'Jl. KH. Wahid Hasyim, Jakarta Pusat',  city: 'Jakarta Pusat',  imageUrl: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=800&q=80' },
    { name: 'Pasar Minggu',      slug: 'pasar-minggu',      address: 'Jl. Ragunan No. 5, Jakarta Selatan',   city: 'Jakarta Selatan',imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80' },
    { name: 'Pasar Tomang',      slug: 'pasar-tomang',      address: 'Jl. Tomang Raya No. 3, Jakarta Barat', city: 'Jakarta Barat',  imageUrl: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80' },
  ]

  const mktMap: Record<string, any> = {}
  for (const m of markets) {
    mktMap[m.slug] = await prisma.market.upsert({ where: { slug: m.slug }, update: {}, create: m })
  }

  // ── Categories ───────────────────────────────────────────────────────────
  const catData = [
    { name: 'Sayuran',       slug: 'sayuran',      icon: '🥬', imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80' },
    { name: 'Buah-buahan',   slug: 'buah',         icon: '🍎', imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80' },
    { name: 'Daging & Ayam', slug: 'daging',       icon: '🥩', imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80' },
    { name: 'Ikan & Seafood', slug: 'ikan',        icon: '🐟', imageUrl: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&q=80' },
    { name: 'Bumbu & Rempah', slug: 'bumbu',       icon: '🌶️', imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80' },
    { name: 'Telur & Susu',  slug: 'telur-susu',   icon: '🥚', imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80' },
    { name: 'Beras & Kering', slug: 'beras-kering', icon: '🌾', imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80' },
    { name: 'Jajanan Pasar', slug: 'jajanan',      icon: '🍡', imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80' },
  ]

  const catMap: Record<string, any> = {}
  for (const c of catData) {
    catMap[c.slug] = await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c })
  }

  // ── Shops ────────────────────────────────────────────────────────────────
  const shopDefs = [
    { id: 'shop-001', userId: 'demo-seller-001', mkt: 'pasar-koja',        name: 'Sayuran Bu Sari',        rating: 4.8, totalOrders: 312, imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80', desc: 'Sayuran segar langsung dari petani, dipilih setiap pagi.' },
    { id: 'shop-002', userId: 'demo-seller-002', mkt: 'pasar-koja',        name: 'Ikan Segar Pak Budi',    rating: 4.6, totalOrders: 218, imageUrl: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&q=80', desc: 'Ikan dan seafood segar dari Muara Baru setiap hari.' },
    { id: 'shop-003', userId: 'demo-seller-003', mkt: 'pasar-senen',       name: 'Bumbu Lengkap Bu Dewi',  rating: 4.9, totalOrders: 445, imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80', desc: 'Bumbu dan rempah segar siap masak, lengkap!' },
    { id: 'shop-004', userId: 'demo-seller-004', mkt: 'pasar-senen',       name: 'Buah Segar Pak Hendra',  rating: 4.7, totalOrders: 189, imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80', desc: 'Buah impor dan lokal pilihan setiap hari.' },
    { id: 'shop-005', userId: 'demo-seller-005', mkt: 'pasar-santa',       name: 'Daging Premium Bu Rina', rating: 4.8, totalOrders: 267, imageUrl: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80', desc: 'Daging sapi dan ayam segar berkualitas premium.' },
    { id: 'shop-006', userId: 'demo-seller-006', mkt: 'pasar-santa',       name: 'Organik Pak Agus',       rating: 4.9, totalOrders: 521, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80', desc: 'Sayuran dan buah organik bersertifikat.' },
    { id: 'shop-007', userId: 'demo-seller-007', mkt: 'pasar-tanah-abang', name: 'Sembako Bu Tuti',        rating: 4.5, totalOrders: 632, imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80', desc: 'Kebutuhan dapur lengkap, beras, minyak, gula dan lainnya.' },
    { id: 'shop-008', userId: 'demo-seller-008', mkt: 'pasar-tanah-abang', name: 'Telur & Susu Pak Joko',  rating: 4.6, totalOrders: 298, imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&q=80', desc: 'Telur ayam kampung dan produk susu segar.' },
    { id: 'shop-009', userId: 'demo-seller-009', mkt: 'pasar-minggu',      name: 'Jajanan Bu Ani',         rating: 4.7, totalOrders: 187, imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80', desc: 'Aneka jajanan pasar tradisional buatan sendiri.' },
    { id: 'shop-010', userId: 'demo-seller-010', mkt: 'pasar-minggu',      name: 'Sayuran Pak Wahyu',      rating: 4.5, totalOrders: 143, imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80', desc: 'Sayuran segar langsung dari kebun Jawa Barat.' },
    { id: 'shop-011', userId: 'demo-seller-011', mkt: 'pasar-tomang',      name: 'Seafood Bu Lestari',     rating: 4.8, totalOrders: 356, imageUrl: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?w=600&q=80', desc: 'Aneka seafood segar pilihan langsung dari nelayan.' },
    { id: 'shop-012', userId: 'demo-seller-012', mkt: 'pasar-tomang',      name: 'Rempah Pak Doni',        rating: 4.6, totalOrders: 201, imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&q=80', desc: 'Rempah-rempah segar dan kering pilihan.' },
  ]

  const shopMap: Record<string, any> = {}
  for (const s of shopDefs) {
    const sl = slug(s.name)
    shopMap[s.id] = await prisma.sellerShop.upsert({
      where: { slug: sl },
      update: {},
      create: {
        id: s.id, userId: s.userId, marketId: mktMap[s.mkt].id,
        name: s.name, slug: sl, description: s.desc, imageUrl: s.imageUrl,
        phone: users.find(u => u.id === s.userId)?.phone,
        isVerified: true, rating: s.rating, totalOrders: s.totalOrders,
      },
    })
  }

  // ── Products ─────────────────────────────────────────────────────────────
  type Prod = { name: string; price: number; unit: string; stock: number; catSlug: string; img: string; desc: string }

  const prodsByShop: Record<string, Prod[]> = {
    'shop-001': [
      { name: 'Bayam Hijau Segar',  price: 5000,  unit: 'ikat', stock: 50,  catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80', desc: 'Bayam hijau segar petik pagi, kaya zat besi.' },
      { name: 'Wortel Lokal',       price: 8000,  unit: 'kg',   stock: 30,  catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80', desc: 'Wortel oranye manis dari Jawa Barat.' },
      { name: 'Tomat Merah',        price: 12000, unit: 'kg',   stock: 25,  catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80', desc: 'Tomat merah segar, cocok untuk masak dan jus.' },
      { name: 'Kangkung Segar',     price: 4000,  unit: 'ikat', stock: 40,  catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80', desc: 'Kangkung segar dipetik tiap pagi.' },
      { name: 'Buncis Muda',        price: 10000, unit: 'kg',   stock: 20,  catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=400&q=80', desc: 'Buncis muda renyah dan segar.' },
      { name: 'Timun Jepang',       price: 7000,  unit: 'kg',   stock: 35,  catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&q=80', desc: 'Timun jepang segar cocok untuk lalapan.' },
      { name: 'Terong Ungu',        price: 9000,  unit: 'kg',   stock: 22,  catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1613743983303-b3e89f8a2b80?w=400&q=80', desc: 'Terong ungu segar pilihan.' },
      { name: 'Kacang Panjang',     price: 6000,  unit: 'ikat', stock: 30,  catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=400&q=80', desc: 'Kacang panjang muda dan segar.' },
      { name: 'Sawi Hijau',         price: 5500,  unit: 'ikat', stock: 25,  catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', desc: 'Sawi hijau segar tanpa pestisida.' },
      { name: 'Pisang Kepok',       price: 15000, unit: 'sisir',stock: 20,  catSlug: 'buah',    img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80', desc: 'Pisang kepok manis bagus untuk digoreng.' },
      { name: 'Telur Ayam Kampung', price: 35000, unit: 'kg',   stock: 100, catSlug: 'telur-susu', img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80', desc: 'Telur ayam kampung asli, kuning telur orange.' },
      { name: 'Beras Premium IR64', price: 65000, unit: 'kg',   stock: 200, catSlug: 'beras-kering', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80', desc: 'Beras premium pulen untuk nasi sehari-hari.' },
    ],
    'shop-002': [
      { name: 'Ikan Nila Segar',        price: 28000,  unit: 'kg', stock: 20, catSlug: 'ikan', img: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&q=80', desc: 'Ikan nila segar dari kolam lokal.' },
      { name: 'Udang Vaname',           price: 75000,  unit: 'kg', stock: 15, catSlug: 'ikan', img: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?w=400&q=80', desc: 'Udang vaname segar ukuran sedang.' },
      { name: 'Ikan Bandeng Presto',    price: 45000,  unit: 'kg', stock: 10, catSlug: 'ikan', img: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=400&q=80', desc: 'Bandeng presto siap masak, tanpa duri.' },
      { name: 'Cumi-cumi Segar',        price: 55000,  unit: 'kg', stock: 12, catSlug: 'ikan', img: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&q=80', desc: 'Cumi-cumi segar dari laut utara Jawa.' },
      { name: 'Ayam Potong Kampung',    price: 38000,  unit: 'kg', stock: 25, catSlug: 'daging', img: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80', desc: 'Ayam kampung potong segar dipotong saat dipesan.' },
      { name: 'Daging Sapi Rendang',    price: 130000, unit: 'kg', stock: 8,  catSlug: 'daging', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80', desc: 'Daging sapi pilihan untuk rendang.' },
      { name: 'Ikan Kakap Merah',       price: 65000,  unit: 'kg', stock: 10, catSlug: 'ikan', img: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&q=80', desc: 'Kakap merah segar untuk bakar atau goreng.' },
      { name: 'Kerang Hijau',           price: 35000,  unit: 'kg', stock: 18, catSlug: 'ikan', img: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&q=80', desc: 'Kerang hijau segar dari Teluk Jakarta.' },
    ],
    'shop-003': [
      { name: 'Bawang Merah Brebes',  price: 35000, unit: 'kg', stock: 50, catSlug: 'bumbu', img: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&q=80', desc: 'Bawang merah Brebes asli, harum dan tajam.' },
      { name: 'Bawang Putih Lokal',   price: 30000, unit: 'kg', stock: 45, catSlug: 'bumbu', img: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&q=80', desc: 'Bawang putih lokal segar.' },
      { name: 'Cabai Merah Keriting', price: 45000, unit: 'kg', stock: 20, catSlug: 'bumbu', img: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&q=80', desc: 'Cabai merah keriting pedas segar.' },
      { name: 'Cabai Rawit Hijau',    price: 40000, unit: 'kg', stock: 18, catSlug: 'bumbu', img: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80', desc: 'Cabai rawit hijau super pedas.' },
      { name: 'Jahe Emprit',          price: 20000, unit: 'kg', stock: 30, catSlug: 'bumbu', img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80', desc: 'Jahe emprit segar, harum dan pedas.' },
      { name: 'Kunyit Segar',         price: 15000, unit: 'kg', stock: 25, catSlug: 'bumbu', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80', desc: 'Kunyit segar untuk masak dan kesehatan.' },
      { name: 'Kemiri Kupas',         price: 50000, unit: 'kg', stock: 15, catSlug: 'bumbu', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80', desc: 'Kemiri kupas siap haluskan.' },
      { name: 'Serai Segar',          price: 10000, unit: 'ikat',stock: 30, catSlug: 'bumbu', img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80', desc: 'Serai segar wangi untuk masakan.' },
      { name: 'Daun Salam',           price: 5000,  unit: 'ikat',stock: 40, catSlug: 'bumbu', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80', desc: 'Daun salam segar untuk masakan nusantara.' },
    ],
    'shop-004': [
      { name: 'Mangga Harum Manis',  price: 25000, unit: 'kg', stock: 30, catSlug: 'buah', img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&q=80', desc: 'Mangga harum manis matang pohon.' },
      { name: 'Semangka Merah',      price: 12000, unit: 'kg', stock: 20, catSlug: 'buah', img: 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400&q=80', desc: 'Semangka merah manis dan segar.' },
      { name: 'Jeruk Manis Pontianak',price:20000, unit: 'kg', stock: 25, catSlug: 'buah', img: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&q=80', desc: 'Jeruk manis Pontianak asli.' },
      { name: 'Apel Fuji Import',    price: 35000, unit: 'kg', stock: 15, catSlug: 'buah', img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&q=80', desc: 'Apel Fuji import segar dan manis.' },
      { name: 'Anggur Hijau Import', price: 55000, unit: 'kg', stock: 10, catSlug: 'buah', img: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80', desc: 'Anggur hijau seedless import.' },
      { name: 'Pepaya California',   price: 12000, unit: 'kg', stock: 20, catSlug: 'buah', img: 'https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400&q=80', desc: 'Pepaya california manis dan lembut.' },
      { name: 'Melon Hijau',         price: 18000, unit: 'kg', stock: 15, catSlug: 'buah', img: 'https://images.unsplash.com/photo-1571680322279-a226e6a4cc2a?w=400&q=80', desc: 'Melon hijau manis dan harum.' },
    ],
    'shop-005': [
      { name: 'Daging Sapi Has Dalam', price: 145000, unit: 'kg', stock: 8,  catSlug: 'daging', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80', desc: 'Daging sapi has dalam premium untuk steak.' },
      { name: 'Ayam Broiler Segar',    price: 32000,  unit: 'kg', stock: 30, catSlug: 'daging', img: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80', desc: 'Ayam broiler segar dipotong fresh.' },
      { name: 'Daging Kambing',        price: 120000, unit: 'kg', stock: 5,  catSlug: 'daging', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80', desc: 'Daging kambing segar untuk sate dan gulai.' },
      { name: 'Hati Sapi Segar',       price: 65000,  unit: 'kg', stock: 10, catSlug: 'daging', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80', desc: 'Hati sapi segar kaya nutrisi.' },
      { name: 'Iga Sapi',              price: 110000, unit: 'kg', stock: 7,  catSlug: 'daging', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&q=80', desc: 'Iga sapi untuk sup dan bakar.' },
    ],
    'shop-006': [
      { name: 'Bayam Organik',       price: 8000,  unit: 'ikat', stock: 30, catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80', desc: 'Bayam organik bersertifikat, bebas pestisida.' },
      { name: 'Selada Organik',      price: 12000, unit: 'ikat', stock: 25, catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80', desc: 'Selada hijau organik segar untuk salad.' },
      { name: 'Brokoli Organik',     price: 18000, unit: 'kg',   stock: 20, catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&q=80', desc: 'Brokoli organik segar bebas kimia.' },
      { name: 'Tomat Cherry Organik',price: 22000, unit: 'kg',   stock: 15, catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&q=80', desc: 'Tomat cherry organik manis dan segar.' },
      { name: 'Stroberi Lokal',      price: 35000, unit: 'kg',   stock: 10, catSlug: 'buah',    img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80', desc: 'Stroberi lokal dari Cianjur, segar manis.' },
      { name: 'Wortel Baby Organik', price: 15000, unit: 'kg',   stock: 18, catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80', desc: 'Wortel baby organik untuk camilan sehat.' },
    ],
    'shop-007': [
      { name: 'Beras Pandan Wangi',  price: 75000, unit: 'kg',   stock: 150, catSlug: 'beras-kering', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80', desc: 'Beras pandan wangi pulen harum.' },
      { name: 'Minyak Goreng 2L',    price: 35000, unit: 'botol',stock: 80,  catSlug: 'beras-kering', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80', desc: 'Minyak goreng sawit murni 2 liter.' },
      { name: 'Gula Pasir 1kg',      price: 16000, unit: 'kg',   stock: 100, catSlug: 'beras-kering', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80', desc: 'Gula pasir putih halus.' },
      { name: 'Tepung Terigu 1kg',   price: 12000, unit: 'kg',   stock: 90,  catSlug: 'beras-kering', img: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400&q=80', desc: 'Tepung terigu serbaguna protein tinggi.' },
      { name: 'Kacang Tanah Kupas',  price: 28000, unit: 'kg',   stock: 40,  catSlug: 'beras-kering', img: 'https://images.unsplash.com/photo-1567633690828-ec2db6c9e1da?w=400&q=80', desc: 'Kacang tanah kupas bersih siap masak.' },
      { name: 'Kedelai Lokal',       price: 22000, unit: 'kg',   stock: 35,  catSlug: 'beras-kering', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80', desc: 'Kedelai lokal untuk tempe dan tahu.' },
    ],
    'shop-008': [
      { name: 'Telur Ayam Kampung',  price: 35000, unit: 'kg',    stock: 100, catSlug: 'telur-susu', img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80', desc: 'Telur ayam kampung asli kuning telur orange.' },
      { name: 'Telur Bebek',         price: 40000, unit: 'kg',    stock: 50,  catSlug: 'telur-susu', img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80', desc: 'Telur bebek segar untuk martabak dan kue.' },
      { name: 'Susu Sapi Segar 1L',  price: 18000, unit: 'liter', stock: 30,  catSlug: 'telur-susu', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80', desc: 'Susu sapi segar dari peternakan lokal.' },
      { name: 'Keju Cheddar Lokal',  price: 45000, unit: 'pcs',   stock: 20,  catSlug: 'telur-susu', img: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80', desc: 'Keju cheddar lokal untuk masak dan snack.' },
      { name: 'Yogurt Plain 500gr',  price: 22000, unit: 'pcs',   stock: 25,  catSlug: 'telur-susu', img: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80', desc: 'Yogurt plain probiotik segar.' },
    ],
    'shop-009': [
      { name: 'Lemper Ayam',         price: 5000,  unit: 'pcs',   stock: 30, catSlug: 'jajanan', img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80', desc: 'Lemper ayam kukus isi ayam suwir bumbu.' },
      { name: 'Onde-onde',           price: 3000,  unit: 'pcs',   stock: 50, catSlug: 'jajanan', img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80', desc: 'Onde-onde isi kacang hijau manis.' },
      { name: 'Klepon',              price: 2500,  unit: 'pcs',   stock: 60, catSlug: 'jajanan', img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80', desc: 'Klepon isi gula merah berbalut kelapa parut.' },
      { name: 'Risoles Mayonnaise',  price: 6000,  unit: 'pcs',   stock: 40, catSlug: 'jajanan', img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80', desc: 'Risoles isi ayam sayuran dengan saus mayo.' },
      { name: 'Pastel Goreng',       price: 5000,  unit: 'pcs',   stock: 35, catSlug: 'jajanan', img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80', desc: 'Pastel isi wortel kentang ayam.' },
      { name: 'Putu Ayu',            price: 3500,  unit: 'pcs',   stock: 40, catSlug: 'jajanan', img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80', desc: 'Putu ayu pandan lembut dan manis.' },
      { name: 'Bika Ambon',          price: 8000,  unit: 'pcs',   stock: 25, catSlug: 'jajanan', img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&q=80', desc: 'Bika ambon Medan asli berlubang kenyal.' },
    ],
    'shop-010': [
      { name: 'Kubis Segar',         price: 7000,  unit: 'kg',   stock: 30, catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=400&q=80', desc: 'Kubis segar putih untuk tumis dan sup.' },
      { name: 'Pare Hijau',          price: 8000,  unit: 'kg',   stock: 20, catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80', desc: 'Pare hijau segar untuk tumis.' },
      { name: 'Jagung Manis',        price: 6000,  unit: 'buah', stock: 50, catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&q=80', desc: 'Jagung manis segar cocok untuk bakar dan rebus.' },
      { name: 'Singkong Segar',      price: 5000,  unit: 'kg',   stock: 40, catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80', desc: 'Singkong segar untuk direbus dan digoreng.' },
      { name: 'Labu Siam',           price: 6500,  unit: 'kg',   stock: 25, catSlug: 'sayuran', img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80', desc: 'Labu siam muda segar untuk sayur lodeh.' },
    ],
    'shop-011': [
      { name: 'Lobster Air Tawar',   price: 180000, unit: 'kg', stock: 5,  catSlug: 'ikan', img: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&q=80', desc: 'Lobster air tawar segar untuk bakar.' },
      { name: 'Kepiting Soka',       price: 120000, unit: 'kg', stock: 8,  catSlug: 'ikan', img: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&q=80', desc: 'Kepiting soka segar pilihan.' },
      { name: 'Udang Jumbo',         price: 95000,  unit: 'kg', stock: 12, catSlug: 'ikan', img: 'https://images.unsplash.com/photo-1606131731446-5568d87113aa?w=400&q=80', desc: 'Udang jumbo tiger segar ukuran besar.' },
      { name: 'Ikan Gurame',         price: 55000,  unit: 'kg', stock: 10, catSlug: 'ikan', img: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&q=80', desc: 'Ikan gurame segar untuk bakar atau goreng.' },
      { name: 'Ikan Lele Jumbo',     price: 28000,  unit: 'kg', stock: 25, catSlug: 'ikan', img: 'https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=400&q=80', desc: 'Lele jumbo segar dari kolam bersih.' },
      { name: 'Sotong Segar',        price: 60000,  unit: 'kg', stock: 8,  catSlug: 'ikan', img: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&q=80', desc: 'Sotong segar untuk cah dan tumis.' },
    ],
    'shop-012': [
      { name: 'Kayu Manis Batang',   price: 25000, unit: 'kg',   stock: 20, catSlug: 'bumbu', img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80', desc: 'Kayu manis batang asli harum.' },
      { name: 'Cengkeh Segar',       price: 80000, unit: 'kg',   stock: 10, catSlug: 'bumbu', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80', desc: 'Cengkeh pilihan dari Maluku.' },
      { name: 'Ketumbar Biji',       price: 30000, unit: 'kg',   stock: 25, catSlug: 'bumbu', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80', desc: 'Ketumbar biji utuh segar harum.' },
      { name: 'Merica Hitam',        price: 55000, unit: 'kg',   stock: 15, catSlug: 'bumbu', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80', desc: 'Merica hitam biji utuh tajam.' },
      { name: 'Kapulaga',            price: 95000, unit: 'kg',   stock: 8,  catSlug: 'bumbu', img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&q=80', desc: 'Kapulaga asli untuk masakan kari.' },
      { name: 'Daun Kari Segar',     price: 8000,  unit: 'ikat', stock: 30, catSlug: 'bumbu', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80', desc: 'Daun kari segar wangi untuk masakan India.' },
    ],
  }

  for (const [shopId, prods] of Object.entries(prodsByShop)) {
    for (const p of prods) {
      const sl = slug(p.name)
      await prisma.product.upsert({
        where: { shopId_slug: { shopId: shopMap[shopId].id, slug: sl } },
        update: {},
        create: {
          shopId: shopMap[shopId].id,
          categoryId: catMap[p.catSlug].id,
          name: p.name, slug: sl,
          description: p.desc, imageUrl: p.img,
          price: p.price, unit: p.unit, stock: p.stock, minOrder: 0.25,
        },
      })
    }
  }

  console.log('✅ Demo seed selesai!')
  console.log('\nAkun demo (semua password: demo123):')
  console.log('  Admin  : admin@pasarku.id')
  console.log('  Penjual: ibu.sari@pasarku.id / pak.budi@pasarku.id / ibu.dewi@pasarku.id / ...')
  console.log('  Pembeli: pembeli@pasarku.id / rani@pasarku.id')
  console.log('  Kurir  : kurir@pasarku.id / kurir2@pasarku.id')
  console.log('\n6 Pasar | 12 Toko | 80+ Produk berfotos 📸')
}

main().catch(console.error).finally(() => prisma.$disconnect())
