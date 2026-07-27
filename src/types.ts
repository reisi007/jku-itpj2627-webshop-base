export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  brand?: string;
  tags: string[];
  attributes: Record<string, string | number | boolean>;
  variants: Variant[];
}

export interface Variant {
  id: string;
  sku: string;
  name: string;
  attributes: Record<string, string | number | boolean>;
  offers: Offer[];
}

export interface Offer {
  id: string;
  vendorId: string;
  warehouseId: string;
  price: number;
  currency: "EUR";
  shippingCost: number;
  freeShippingThreshold?: number;
  deliveryDays: { min: number; max: number };
  stock: number;
}

export interface Vendor {
  id: string;
  name: string;
  rating: number;
}

export interface Warehouse {
  id: string;
  name: string;
  country: string;
}

export interface Voucher {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrderValue?: number;
  validUntil?: string;
  categoryId?: string;
  description: string;
}

export interface Dataset {
  categories: Category[];
  products: Product[];
  vendors: Vendor[];
  warehouses: Warehouse[];
  vouchers: Voucher[];
}

export interface ValidateRequest {
  items: { offerId: string; quantity: number }[];
  voucherCode?: string;
}

export type CartIssueCode =
  | "OFFER_NOT_FOUND"
  | "INVALID_QUANTITY"
  | "OUT_OF_STOCK"
  | "VOUCHER_NOT_FOUND"
  | "VOUCHER_EXPIRED"
  | "VOUCHER_MIN_ORDER_NOT_MET";

export interface CartIssue {
  code: CartIssueCode;
  message: string;
  offerId?: string;
}

export interface ShipmentItem {
  offerId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Shipment {
  vendorId: string;
  warehouseId: string;
  items: ShipmentItem[];
  itemsSubtotal: number;
  shippingCost: number;
  deliveryDays: { min: number; max: number };
}

export interface Totals {
  items: number;
  shipping: number;
  discount: number;
  grand: number;
}

export interface ValidateResponse {
  valid: boolean;
  issues: CartIssue[];
  shipments: Shipment[];
  totals: Totals;
  deliveryDays: { min: number; max: number } | null;
  packageCount: number;
}
