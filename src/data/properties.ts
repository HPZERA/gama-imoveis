import type { Category } from "@/types";

// Imagens de fundo fixas para os 4 cards de categoria da home — a contagem
// exibida vem do banco (ver Categories/index.tsx), só o visual é estático.
export const categories: Category[] = [
  {
    "id": "1",
    "name": "Casas",
    "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80",
    "count": 92,
    "type": "house"
  },
  {
    "id": "2",
    "name": "Apartamentos",
    "image": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=700&q=80",
    "count": 32,
    "type": "apartment"
  },
  {
    "id": "3",
    "name": "Comercial",
    "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=700&q=80",
    "count": 6,
    "type": "commercial"
  },
  {
    "id": "4",
    "name": "Terrenos",
    "image": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80",
    "count": 3,
    "type": "land"
  }
];
