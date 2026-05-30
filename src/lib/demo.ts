// Demo mode — hardcoded user IDs for prototype
// These match the seed data in prisma/seed.demo.ts
export const DEMO_USERS = {
  admin:   { id: 'demo-admin-001',   email: 'admin@pasarku.id',       role: 'ADMIN'   },
  seller:  { id: 'demo-seller-001',  email: 'ibu.sari@pasarku.id',    role: 'SELLER'  },
  seller2: { id: 'demo-seller-002',  email: 'pak.budi@pasarku.id',    role: 'SELLER'  },
  seller3: { id: 'demo-seller-003',  email: 'ibu.dewi@pasarku.id',    role: 'SELLER'  },
  buyer:   { id: 'demo-buyer-001',   email: 'pembeli@pasarku.id',     role: 'BUYER'   },
  buyer2:  { id: 'demo-buyer-002',   email: 'rani@pasarku.id',        role: 'BUYER'   },
  courier: { id: 'demo-courier-001', email: 'kurir@pasarku.id',       role: 'COURIER' },
  courier2:{ id: 'demo-courier-002', email: 'kurir2@pasarku.id',      role: 'COURIER' },
}
