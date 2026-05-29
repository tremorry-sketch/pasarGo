export type Role = 'BUYER' | 'SELLER' | 'COURIER' | 'ADMIN'

export type OrderStatus =
  | 'DRAFT'
  | 'PLACED'
  | 'SELLER_REVIEW'
  | 'SELLER_CONFIRMED'
  | 'PACKING'
  | 'READY_FOR_PICKUP'
  | 'FINDING_COURIER'
  | 'COURIER_ASSIGNED'
  | 'PICKED_UP'
  | 'ON_DELIVERY'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTE'

export type DeliveryStatus =
  | 'AVAILABLE'
  | 'ACCEPTED'
  | 'HEADING_TO_SELLER'
  | 'PICKED_UP'
  | 'ON_DELIVERY'
  | 'DELIVERED'

export type PaymentMethod = 'COD' | 'MANUAL_TRANSFER'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: Role
  avatar?: string
  address?: string
  isActive: boolean
  createdAt: string
}

export interface Market {
  id: string
  name: string
  slug: string
  address: string
  city: string
  imageUrl?: string
  isActive: boolean
  _count?: { sellerShops: number }
}

export interface SellerShop {
  id: string
  userId: string
  marketId: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  phone?: string
  isActive: boolean
  isVerified: boolean
  rating: number
  totalOrders: number
  market?: Market
  user?: User
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string
  imageUrl?: string
  isActive: boolean
}

export interface Product {
  id: string
  shopId: string
  categoryId: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  unit: string
  price: number
  stock: number
  minOrder: number
  isActive: boolean
  shop?: SellerShop
  category?: Category
}

export interface CartItem {
  id: string
  productId: string
  quantity: number
  note?: string
  product: Product
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productUnit: string
  quantity: number
  priceAtOrder: number
  finalPrice?: number
  finalQuantity?: number
  note?: string
  isCancelled: boolean
}

export interface Order {
  id: string
  orderNumber: string
  buyerId: string
  shopId: string
  status: OrderStatus
  subtotal: number
  deliveryFee: number
  platformFee: number
  total: number
  deliveryAddress: string
  deliveryNote?: string
  buyerNote?: string
  ifStockEmpty: string
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  createdAt: string
  updatedAt: string
  buyer?: User
  shop?: SellerShop
  items?: OrderItem[]
  delivery?: Delivery
  statusLogs?: OrderStatusLog[]
}

export interface Delivery {
  id: string
  orderId: string
  courierId?: string
  status: DeliveryStatus
  pickupAddress: string
  dropAddress: string
  proofImageUrl?: string
  acceptedAt?: string
  pickedUpAt?: string
  deliveredAt?: string
  courier?: User
  order?: Order
}

export interface OrderStatusLog {
  id: string
  orderId: string
  status: OrderStatus
  note?: string
  createdBy?: string
  createdAt: string
}

export interface Notification {
  id: string
  title: string
  body: string
  type: string
  isRead: boolean
  createdAt: string
}

export interface Rating {
  id: string
  orderId: string
  sellerScore?: number
  courierScore?: number
  sellerReview?: string
  courierReview?: string
  createdAt: string
}
