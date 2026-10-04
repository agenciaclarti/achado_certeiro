/**
 * @typedef {Object} Product
 * @property {string} id Identificador interno único e estável.
 * @property {string} slug Identificador legível preparado para URL.
 * @property {string} name Nome exibido.
 * @property {string} category ID da categoria principal.
 * @property {string} image Imagem principal do card.
 * @property {string} affiliateUrl URL externa da loja parceira.
 * @property {string} createdAt Data ISO de inclusão.
 * @property {boolean} developmentOnly Indica um registro fictício de desenvolvimento.
 * @property {string} [shortDescription]
 * @property {string} [description]
 * @property {string} [subcategory]
 * @property {number} [price]
 * @property {number} [oldPrice]
 * @property {number} [discount]
 * @property {string} [installments]
 * @property {string} [imageAlt]
 * @property {string[]} [images] Imagens adicionais para uma futura galeria.
 * @property {boolean} [featured]
 * @property {string[]} [tags]
 * @property {string[]} [collections]
 * @property {string} [badge]
 * @property {number} [rating]
 * @property {number} [reviews]
 */

/**
 * Catálogo local temporário.
 *
 * IMPORTANTE: todos os produtos deste arquivo são FICTÍCIOS e existem apenas
 * para desenvolvimento visual. Antes da publicação, substitua os registros,
 * preços, avaliações, imagens e links pelos dados reais validados.
 *
 * Campos obrigatórios: id, name, slug, category, image, affiliateUrl,
 * createdAt e developmentOnly.
 * Os demais campos são opcionais e a interface deve funcionar sem eles.
 */

export const catalogMeta = {
  source: "local-javascript",
  containsFictitiousProducts: true,
  notice: "Dados fictícios para desenvolvimento visual; não publicar como ofertas reais."
};

export const categories = [
  { id: "casa", label: "Casa", icon: "home", background: "#fff0e8", accent: "#e9440c" },
  { id: "cozinha", label: "Cozinha", icon: "kitchen", background: "#fff3d8", accent: "#a96816" },
  { id: "tecnologia", label: "Tecnologia", icon: "tech", background: "#e5f0fa", accent: "#316f9f" },
  { id: "beleza", label: "Beleza", icon: "beauty", background: "#f7e8ef", accent: "#a54f78" },
  { id: "moda", label: "Moda", icon: "fashion", background: "#f7e9e5", accent: "#a94e40" },
  { id: "acessorios", label: "Acessórios", icon: "watch", background: "#e8eff4", accent: "#41677d" },
  { id: "organizacao", label: "Organização", icon: "organize", background: "#e5f1e9", accent: "#377454" },
  { id: "utilidades", label: "Utilidades", icon: "spark", background: "#f1ebde", accent: "#77613d" },
  { id: "eletronicos", label: "Eletrônicos", icon: "plug", background: "#ece9f7", accent: "#66519b" },
  { id: "escritorio", label: "Escritório", icon: "office", background: "#e8f2f0", accent: "#3e746d" }
];

const developmentPartnerUrl = "https://shopee.com.br/";

/** @type {Product[]} */
export const products = [
  {
    id: "dev-001", slug: "fone-bluetooth-confort", name: "Fone Bluetooth com almofadas confortáveis",
    shortDescription: "Fone sem fio com estrutura acolchoada.", description: "Modelo fictício criado para validar cards e vitrines de tecnologia.",
    category: "tecnologia", subcategory: "audio", price: 89.9, oldPrice: 129.9, discount: 31,
    installments: "ou 3x de R$ 29,97", rating: 4.8, reviews: 1240, badge: "Boa avaliação",
    image: "assets/images/products/fones.svg", imageAlt: "Ilustração de um fone de ouvido laranja", affiliateUrl: developmentPartnerUrl,
    featured: true, tags: ["bluetooth", "audio", "home office"], collections: ["daily", "popular", "tech"], createdAt: "2026-09-18T12:00:00-03:00", developmentOnly: true
  },
  {
    id: "dev-002", slug: "organizador-multiuso", name: "Organizador multiuso para deixar tudo à mão",
    shortDescription: "Organizador compacto para diferentes ambientes.", description: "Produto fictício para demonstrar soluções de organização doméstica.",
    category: "organizacao", subcategory: "organizadores", price: 54.9, oldPrice: 72.5, discount: 24,
    rating: 4.9, reviews: 867, badge: "Mais querido", image: "assets/images/products/organizador.svg",
    imageAlt: "Ilustração de um organizador doméstico", affiliateUrl: developmentPartnerUrl, featured: true,
    tags: ["organização", "casa", "multiuso"], collections: ["daily", "popular", "home"], createdAt: "2026-09-23T10:30:00-03:00", developmentOnly: true
  },
  {
    id: "dev-003", slug: "garrafa-termica-compacta", name: "Garrafa térmica compacta para o dia a dia",
    shortDescription: "Garrafa compacta para levar na bolsa.", category: "utilidades", subcategory: "garrafas",
    price: 42.9, badge: "Prático", image: "assets/images/products/garrafa.svg", imageAlt: "Ilustração de uma garrafa térmica coral",
    affiliateUrl: developmentPartnerUrl, featured: true, tags: ["garrafa", "rotina", "térmica"],
    collections: ["daily"], createdAt: "2026-09-29T09:00:00-03:00", developmentOnly: true
  },
  {
    id: "dev-004", slug: "escova-modeladora-ergonomica", name: "Escova modeladora com design ergonômico",
    shortDescription: "Escova modeladora para cuidados diários.", category: "beleza", subcategory: "cabelos",
    price: 119.9, oldPrice: 159.9, discount: 25, installments: "ou 4x de R$ 29,98", rating: 4.8, reviews: 932,
    badge: "Achado da vez", image: "assets/images/products/escova.svg", imageAlt: "Ilustração de uma escova modeladora",
    affiliateUrl: developmentPartnerUrl, featured: true, tags: ["beleza", "cabelo", "modelador"],
    collections: ["daily", "popular", "beauty"], createdAt: "2026-09-12T14:00:00-03:00", developmentOnly: true
  },
  {
    id: "dev-005", slug: "kit-potes-hermeticos", name: "Kit de potes herméticos para mantimentos",
    shortDescription: "Conjunto ilustrativo para organização da despensa.", category: "cozinha", subcategory: "armazenamento",
    price: 76.5, oldPrice: 98.9, rating: 4.9, reviews: 2104, image: "assets/images/products/potes.svg",
    imageAlt: "Ilustração de três potes organizadores", affiliateUrl: developmentPartnerUrl, featured: true,
    tags: ["cozinha", "potes", "despensa", "organização"], collections: ["popular", "home"], createdAt: "2026-09-21T11:00:00-03:00", developmentOnly: true
  },
  {
    id: "dev-006", slug: "suporte-ajustavel-notebook", name: "Suporte ajustável para notebook e tablet",
    shortDescription: "Suporte para elevar telas na mesa de trabalho.", category: "escritorio", subcategory: "ergonomia",
    price: 49.9, oldPrice: 67.9, discount: 26, rating: 4.7, reviews: 621, badge: "Home office",
    image: "assets/images/products/suporte.svg", imageAlt: "Ilustração de um notebook sobre um suporte", affiliateUrl: developmentPartnerUrl,
    tags: ["notebook", "escritório", "ergonomia"], collections: ["popular", "tech"], createdAt: "2026-09-20T08:30:00-03:00", developmentOnly: true
  },
  {
    id: "dev-007", slug: "massageador-portatil", name: "Massageador portátil com quatro pontos",
    shortDescription: "Acessório compacto para momentos de relaxamento.", category: "beleza", subcategory: "cuidados",
    price: 97.9, oldPrice: 135, installments: "ou 3x de R$ 32,63", rating: 4.6, reviews: 389,
    image: "assets/images/products/massageador.svg", imageAlt: "Ilustração de um massageador portátil", affiliateUrl: developmentPartnerUrl,
    featured: true, tags: ["massagem", "relaxamento", "autocuidado"], collections: ["beauty"], createdAt: "2026-09-10T16:00:00-03:00", developmentOnly: true
  },
  {
    id: "dev-008", slug: "luminaria-mesa-aconchegante", name: "Luminária de mesa com luz aconchegante",
    shortDescription: "Iluminação decorativa para mesa ou criado-mudo.", category: "casa", subcategory: "iluminacao",
    price: 84.9, rating: 4.9, reviews: 476, badge: "Escolha da curadoria", image: "assets/images/products/luminaria.svg",
    imageAlt: "Ilustração de uma luminária de mesa", affiliateUrl: developmentPartnerUrl, featured: true,
    tags: ["luminária", "decoração", "iluminação"], collections: ["daily", "home"], createdAt: "2026-09-15T19:00:00-03:00", developmentOnly: true
  },
  {
    id: "dev-009", slug: "bolsa-transversal-compacta", name: "Bolsa transversal compacta para rotina",
    shortDescription: "Bolsa pequena para itens essenciais.", category: "moda", subcategory: "bolsas",
    price: 48.5, oldPrice: 64.9, discount: 25, image: "assets/images/products/bolsa.svg",
    imageAlt: "Ilustração de uma bolsa transversal caramelo", affiliateUrl: developmentPartnerUrl, featured: true,
    tags: ["bolsa", "moda", "acessório"], collections: ["daily"], createdAt: "2026-10-01T13:20:00-03:00", developmentOnly: true
  },
  {
    id: "dev-010", slug: "relogio-minimalista", name: "Relógio minimalista com pulseira ajustável",
    shortDescription: "Relógio de visual discreto e pulseira regulável.", category: "acessorios", subcategory: "relogios",
    price: 39.9, rating: 4.7, reviews: 284, image: "assets/images/products/relogio.svg",
    imageAlt: "Ilustração de um relógio de pulso minimalista", affiliateUrl: developmentPartnerUrl, featured: true,
    tags: ["relógio", "acessório", "minimalista"], collections: ["popular"], createdAt: "2026-09-28T15:00:00-03:00", developmentOnly: true
  },
  {
    id: "dev-011", slug: "kit-organizador-cabos", name: "Kit organizador de cabos com cinco peças",
    shortDescription: "Peças coloridas para manter cabos no lugar.", category: "eletronicos", subcategory: "cabos",
    price: 19.9, oldPrice: 26.9, discount: 26, rating: 4.8, image: "assets/images/products/cabos.svg",
    imageAlt: "Ilustração de organizadores coloridos para cabos", affiliateUrl: developmentPartnerUrl,
    tags: ["cabos", "organização", "eletrônicos"], collections: ["daily", "tech"], createdAt: "2026-10-02T10:00:00-03:00", developmentOnly: true
  },
  {
    id: "dev-012", slug: "mini-seladora-portatil", name: "Mini seladora portátil para embalagens",
    shortDescription: "Utilidade compacta para fechar pequenas embalagens.", category: "utilidades", subcategory: "cozinha-pratica",
    price: 22.9, badge: "Até R$ 25", image: "assets/images/products/seladora.svg",
    imageAlt: "Ilustração de uma mini seladora portátil", affiliateUrl: developmentPartnerUrl,
    tags: ["seladora", "cozinha", "utilidade"], collections: ["popular", "home"], createdAt: "2026-09-26T18:00:00-03:00", developmentOnly: true
  },
  {
    id: "dev-013", slug: "necessaire-organizadora", name: "Nécessaire organizadora com divisórias",
    shortDescription: "Estojo com compartimentos para itens de cuidado.", category: "beleza", subcategory: "organizadores",
    price: 24.9, oldPrice: 32.9, rating: 4.9, reviews: 718, image: "assets/images/products/necessaire.svg",
    imageAlt: "Ilustração de uma nécessaire organizadora", affiliateUrl: developmentPartnerUrl,
    tags: ["nécessaire", "viagem", "organização"], collections: ["daily", "beauty"], createdAt: "2026-10-03T09:30:00-03:00", developmentOnly: true
  },
  {
    id: "dev-014", slug: "prateleira-modular", name: "Prateleira modular para pequenos espaços",
    shortDescription: "Módulo vertical para organizar ambientes compactos.", category: "organizacao", subcategory: "prateleiras",
    price: 47.9, rating: 4.6, reviews: 193, image: "assets/images/products/prateleira.svg",
    imageAlt: "Ilustração de uma prateleira modular", affiliateUrl: developmentPartnerUrl,
    tags: ["prateleira", "casa", "organização"], collections: ["home"], createdAt: "2026-09-22T12:00:00-03:00", developmentOnly: true
  },
  {
    id: "dev-015", slug: "teclado-compacto-sem-fio", name: "Teclado compacto sem fio para mesa organizada",
    shortDescription: "Teclado compacto pensado para espaços menores.", category: "tecnologia", subcategory: "perifericos",
    price: 109.9, installments: "ou 3x de R$ 36,63", badge: "Design compacto", image: "assets/images/products/teclado.svg",
    imageAlt: "Ilustração de um teclado compacto sem fio", affiliateUrl: developmentPartnerUrl, featured: true,
    tags: ["teclado", "sem fio", "home office"], collections: ["tech"], createdAt: "2026-09-08T09:00:00-03:00", developmentOnly: true
  },
  {
    id: "dev-016", slug: "mixer-portatil", name: "Mixer portátil para bebidas e receitas rápidas",
    shortDescription: "Mixer compacto para preparos rápidos.", category: "cozinha", subcategory: "eletroportateis",
    price: 64.9, oldPrice: 79.9, rating: 4.5, image: "assets/images/products/mixer.svg",
    imageAlt: "Ilustração de um mixer portátil", affiliateUrl: developmentPartnerUrl,
    tags: ["mixer", "cozinha", "bebidas"], collections: ["home"], createdAt: "2026-09-06T17:00:00-03:00", developmentOnly: true
  },
  {
    id: "dev-017", slug: "espelho-bancada-led", name: "Espelho de bancada com iluminação LED",
    shortDescription: "Espelho de apoio com iluminação frontal.", category: "beleza", subcategory: "acessorios-de-beleza",
    price: 74.9, badge: "Novo por aqui", image: "assets/images/products/espelho.svg",
    imageAlt: "Ilustração de um espelho de bancada iluminado", affiliateUrl: developmentPartnerUrl,
    tags: ["espelho", "led", "beleza"], collections: ["beauty"], createdAt: "2026-10-03T14:00:00-03:00", developmentOnly: true
  },
  {
    id: "dev-018", slug: "hub-usb-multiplas-entradas", name: "Hub USB compacto com múltiplas entradas",
    shortDescription: "Adaptador compacto para ampliar conexões.", category: "eletronicos", subcategory: "conectividade",
    image: "assets/images/products/hub.svg", imageAlt: "Ilustração de um hub USB compacto", affiliateUrl: developmentPartnerUrl,
    tags: ["hub", "usb", "conectividade"], collections: ["tech"], createdAt: "2026-10-04T08:00:00-03:00", developmentOnly: true
  },
  {
    id: "dev-019", slug: "kit-confeiteiro-silicone", name: "Kit Confeiteiro de Silicone",
    category: "cozinha", subcategory: "utensilios-de-confeitaria",
    image: "assets/images/products/cozinha/kitconfeiteirosilicone.png",
    imageAlt: "Kit de utensílios de silicone para confeitaria",
    affiliateUrl: "https://s.shopee.com.br/3B7t8jH2Qg",
    tags: ["confeitaria", "silicone", "cozinha"], collections: ["daily", "home"],
    createdAt: "2026-10-04T12:00:00-03:00", developmentOnly: true
  },
  {
    id: "dev-020", slug: "mini-powerbank", name: "Mini Powerbank",
    category: "eletronicos", subcategory: "carregadores",
    image: "assets/images/products/tech/minipowerbank.png",
    imageAlt: "Mini powerbank portátil com cabo integrado",
    affiliateUrl: "https://s.shopee.com.br/gQZz25wX5",
    tags: ["powerbank", "carregador", "portátil"], collections: ["daily", "tech"],
    createdAt: "2026-10-04T12:05:00-03:00", developmentOnly: true
  }
];

export const editorialCollections = [
  { id: "daily", title: "Achadinhos do dia", eyebrow: "Escolhas fresquinhas", description: "Uma seleção rápida para descobrir algo novo hoje." },
  { id: "featured", title: "Produtos em destaque", eyebrow: "Vale ficar de olho", description: "Os itens que ganharam espaço na nossa curadoria." },
  { id: "under25", title: "Até R$ 25", eyebrow: "Pequenos preços", description: "Utilidades acessíveis para facilitar a rotina." },
  { id: "under50", title: "Até R$ 50", eyebrow: "Cabe no orçamento", description: "Boas ideias com preço informado de até cinquenta reais." },
  { id: "tech", title: "Tecnologia e acessórios", eyebrow: "Para conectar", description: "Itens práticos para trabalho, estudo e entretenimento." },
  { id: "home", title: "Casa e organização", eyebrow: "Seu espaço, melhor", description: "Soluções para uma casa mais funcional e gostosa." },
  { id: "beauty", title: "Beleza e cuidados", eyebrow: "Um tempo para você", description: "Cuidados e acessórios escolhidos sem complicação." }
];
