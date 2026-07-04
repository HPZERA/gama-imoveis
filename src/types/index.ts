export interface Property {
  id: string;
  title: string;
  price: number;
  priceType: "sale" | "rent";
  type: "house" | "apartment" | "commercial" | "land";
  city: string;
  neighborhood: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  images: string[];
  badge?: string;
  featured?: boolean;
  description?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  photo: string;
  rating: number;
  comment: string;
  role?: string;
  date?: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
  type: "house" | "apartment" | "commercial" | "land";
  href?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export type PropertyType = "house" | "apartment" | "commercial" | "land" | "all";
export type TransactionType = "sale" | "rent" | "all";

export interface ImageConfig {
  max_width: number;
  quality: number;
  format: "webp" | "jpg" | "png";
  webp_enabled: boolean;
  max_file_size_mb: number;
  max_images_per_property: number;
  updated_at?: string;
}

export interface UploadStat {
  originalSize: number;
  optimizedSize: number;
  originalWidth?: number;
  originalHeight?: number;
  optimizedWidth: number;
  optimizedHeight: number;
}

export interface DbProperty {
  id: number | string;
  title: string;
  code?: string | null;
  price: number | null;
  price_label: string | null;
  type: "venda" | "aluguel";
  category: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  address: string | null;
  neighborhood: string | null;
  city: string;
  description: string | null;
  featured: boolean;
  active: boolean;
  images: string[] | null;
  created_at: string;
  badge?: string;
}
