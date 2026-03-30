export interface Product {
  slug: string
  name: string
  price: string
  description: string
  image: string
  photos?: string[]
  badge?: string
}

export const products: Product[] = [
  {
    slug: "crv-2016",
    name: "CRV 2016",
    price: "$245,000",
    description: "Honda CR-V 2016 en excelente estado, ideal para ciudad y carretera. Cuenta con amplio espacio interior, buen rendimiento de combustible y gran confiabilidad. Perfecta para uso familiar o diario.",
    image: "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/CRV1.webp",
    photos: [
      "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/CRV1.webp",
      "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/CRV2.webp",
      "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/CRV3.webp",
      "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/CRV4.webp",
    ],
  },
  {
    slug: "comedor",
    name: "Comedor",
    price: "$9,999",
    description: "Comedor elegante y funcional, ideal para espacios modernos. Incluye mesa amplia y sillas cómodas, perfecto para reuniones familiares o cenas. Diseño resistente y estético que se adapta a diferentes estilos de interior.",
    image: "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/COMEDOR1.JPG",
    photos: [
      "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/COMEDOR1.JPG",
      "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/COMEDOR2.JPG",
      "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/COMEDOR3.JPG",
    ],
  },
  {
    slug: "airpods-max",
    name: "AirPods Max",
    price: "$7,999",
    description: "Audífonos AirPods Max en excelente estado, con calidad de sonido premium y cancelación activa de ruido. Diseño elegante, materiales de alta calidad y máxima comodidad para uso prolongado. Ideales para música, trabajo y viajes.",
    image: "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/MAX1.jpg",
    photos: [
      "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/MAX1.jpg",
      "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/MAX2.jpg",
      "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/MAX3.jpg",
    ],
  },
  {
    slug: "dji-flip-drone",
    name: "DJI Flip Drone",
    price: "$6,999",
    description: "Dron DJI Flip en excelente estado, ideal para fotografía y video aéreo. Compacto, fácil de transportar y con gran estabilidad en vuelo. Perfecto para creadores de contenido, viajes y tomas profesionales.",
    image: "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/FLIP1.webp",
    photos: [
      "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/FLIP1.webp",
      "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/FLIP2.webp",
      "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/FLIP3.webp",
      "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/FLIP4.webp",
    ],
  },
  {
    slug: "escritorio-moderno",
    name: "Escritorio moderno",
    price: "$2,299",
    description: "Escritorio funcional y moderno, ideal para home office o estudio. Cuenta con diseño minimalista, buena superficie de trabajo y estructura resistente. Perfecto para trabajar cómodamente y organizar tu espacio.",
    image: "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/Escritorio1.JPG",
    photos: [
      "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/Escritorio1.JPG",
      "https://rvivezcozdjpgkwqgroq.supabase.co/storage/v1/object/public/store/Escritorio2.JPG",
    ],
  },
]
