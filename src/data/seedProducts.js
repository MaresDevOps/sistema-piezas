export const SEED_PRODUCTS = [
  // CPUs
  {
    id: 1,
    name: "AMD Ryzen 9 7950X3D",
    category: "CPU",
    price: 599.00,
    stock: 5,
    watts: 120,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80",
      "https://images.unsplash.com/photo-1587202372585-6126f5ce2558?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Alta: 16 Cores / 32 Threads, 5.7GHz Boost, 144MB Cache, 3D V-Cache"
  },
  {
    id: 2,
    name: "Intel Core i7-14700K",
    category: "CPU",
    price: 389.00,
    stock: 12,
    watts: 125,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80",
      "https://images.unsplash.com/photo-1587202372585-6126f5ce2558?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Media: 20 Cores / 28 Threads, up to 5.6GHz, LGA1700"
  },
  {
    id: 3,
    name: "AMD Ryzen 5 5600X",
    category: "CPU",
    price: 129.00,
    stock: 25,
    watts: 65,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80",
      "https://images.unsplash.com/photo-1587202372585-6126f5ce2558?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Entrada: 6 Cores / 12 Threads, 4.6GHz Boost, PCIe 4.0, Socket AM4"
  },

  // GPUs
  {
    id: 4,
    name: "NVIDIA GeForce RTX 4090 Founders Edition",
    category: "GPU",
    price: 1599.00,
    stock: 2,
    watts: 450,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Alta: 24GB GDDR6X, DLSS 3, 16384 CUDA Cores, Ray Tracing Gen 3"
  },
  {
    id: 5,
    name: "AMD Radeon RX 7800 XT",
    category: "GPU",
    price: 499.00,
    stock: 8,
    watts: 263,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Media: 16GB GDDR6, RDNA 3, AMD Infinity Cache, Ray Accelerator"
  },
  {
    id: 6,
    name: "NVIDIA GeForce RTX 3050",
    category: "GPU",
    price: 179.00,
    stock: 18,
    watts: 130,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80",
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Entrada: 8GB GDDR6, DLSS 2, 2560 CUDA Cores, Ray Tracing"
  },

  // Motherboards
  {
    id: 7,
    name: "ASUS ROG Strix X670E-E Gaming WiFi",
    category: "Motherboard",
    price: 439.00,
    stock: 8,
    watts: 50,
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Alta: AM5, DDR5, PCIe 5.0, Wi-Fi 6E, Aura Sync RGB"
  },
  {
    id: 8,
    name: "MSI B650 GAMING PLUS WIFI",
    category: "Motherboard",
    price: 169.00,
    stock: 15,
    watts: 40,
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Media: AM5, DDR5, Dual M.2 PCIe 4.0, Wi-Fi 6E, Core Boost"
  },
  {
    id: 9,
    name: "ASRock H610M-HVS",
    category: "Motherboard",
    price: 69.00,
    stock: 22,
    watts: 30,
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Entrada: LGA1700, DDR4, PCIe 4.0, Micro ATX, SATA3"
  },

  // RAM
  {
    id: 10,
    name: "Corsair Vengeance RGB 64GB (2x32GB) DDR5 6400",
    category: "RAM",
    price: 219.00,
    stock: 10,
    watts: 15,
    image: "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=800&q=80",
      "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Alta: DDR5 CL32, Perfil Intel XMP 3.0, LEDs RGB Dinámicos"
  },
  {
    id: 11,
    name: "G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 6000",
    category: "RAM",
    price: 119.00,
    stock: 20,
    watts: 10,
    image: "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=800&q=80",
      "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Media: DDR5 CL30, Perfiles AMD EXPO, Disipador Aluminio"
  },
  {
    id: 12,
    name: "Kingston FURY Beast 16GB (2x8GB) DDR4 3200",
    category: "RAM",
    price: 45.00,
    stock: 35,
    watts: 5,
    image: "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1541029071515-84cc54f84dc5?w=800&q=80",
      "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Entrada: DDR4 CL16, Disipador de perfil bajo negro"
  },

  // Storage
  {
    id: 13,
    name: "Samsung 990 Pro 2TB NVMe M.2",
    category: "Storage",
    price: 179.00,
    stock: 25,
    watts: 10,
    image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&q=80",
      "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Alta: PCIe 4.0 NVMe, Lectura secuencial de hasta 7450 MB/s"
  },
  {
    id: 14,
    name: "Crucial P3 Plus 1TB PCIe M.2 SSD",
    category: "Storage",
    price: 69.00,
    stock: 40,
    watts: 7,
    image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&q=80",
      "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Media: PCIe Gen4 NVMe M.2, Lectura de hasta 5000 MB/s"
  },
  {
    id: 15,
    name: "Kingston A400 480GB SATA 2.5\"",
    category: "Storage",
    price: 29.00,
    stock: 50,
    watts: 4,
    image: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&q=80",
      "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Entrada: Interfaz SATA III 6Gb/s, velocidad lectura de 500MB/s"
  },

  // PSUs
  {
    id: 16,
    name: "Corsair HX1200 1200W 80+ Platinum",
    category: "PSU",
    price: 249.00,
    stock: 6,
    watts: 1200,
    isPowerSupply: true,
    image: "https://images.unsplash.com/photo-1591489376439-d3e913a4cbcc?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1591489376439-d3e913a4cbcc?w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Alta: Modulación Completa, Ventilador de Frecuencia Cero, 80 Plus Platinum"
  },
  {
    id: 17,
    name: "MSI MAG A750GL 750W 80+ Gold",
    category: "PSU",
    price: 89.00,
    stock: 18,
    watts: 750,
    isPowerSupply: true,
    image: "https://images.unsplash.com/photo-1591489376439-d3e913a4cbcc?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1591489376439-d3e913a4cbcc?w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Media: Certificación Gold, Cables Planos, Ventilador FDB, ATX 3.0"
  },
  {
    id: 18,
    name: "EVGA 500 W1 500W 80+ White",
    category: "PSU",
    price: 45.00,
    stock: 30,
    watts: 500,
    isPowerSupply: true,
    image: "https://images.unsplash.com/photo-1591489376439-d3e913a4cbcc?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1591489376439-d3e913a4cbcc?w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80"
    ],
    specs: "Gama Entrada: 80 Plus Standard, Cables Con Malla, Ventilador de 120mm"
  },

  // Cases
  {
    id: 19,
    name: "Lian Li O11 Dynamic EVO RGB",
    category: "Case",
    price: 169.00,
    stock: 14,
    watts: 0,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
    ],
    specs: "Gama Alta: Diseño Modular de Doble Cámara, Vidrio Templado Panorámico, Tiras ARGB"
  },
  {
    id: 20,
    name: "NZXT H5 Flow Mid-Tower Black",
    category: "Case",
    price: 89.00,
    stock: 22,
    watts: 0,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
    ],
    specs: "Gama Media: Flujo de aire optimizado, Panel frontal perforado, Incluye ventilador angular"
  },
  {
    id: 21,
    name: "Corsair 3000D Airflow Black",
    category: "Case",
    price: 59.00,
    stock: 28,
    watts: 0,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80"
    ],
    specs: "Gama Entrada: Panel frontal de acero de alta ventilación, Incluye 2 ventiladores SP120"
  }
];
