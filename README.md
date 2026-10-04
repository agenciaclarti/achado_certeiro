# Achado Certeiro

Portal estático e responsivo para curadoria de produtos divulgados por links de afiliado. O projeto apresenta e organiza achados, mas não processa pagamentos, pedidos, estoque ou entregas.

## Arquitetura escolhida

A base usa somente HTML5, CSS3 e JavaScript moderno, sem etapa de build e sem dependências externas. Isso permite publicar o mesmo diretório diretamente no GitHub Pages, Netlify ou Vercel.

```text
/
├── index.html                 # Documento semântico, metadados e regiões da página
├── catalogo.html              # Listagem completa com filtros e URL compartilhável
├── css/
│   ├── reset.css              # Normalização e padrões globais acessíveis
│   ├── variables.css          # Design tokens: cores, tipos, espaços, raios e sombras
│   ├── components.css         # Componentes reutilizáveis
│   ├── catalog.css            # Layout responsivo da página de catálogo
│   └── style.css              # Composição das seções e responsividade
├── js/
│   ├── data.js                # Fonte local e normalizada de categorias e produtos
│   ├── catalog.js             # Consultas, validação, busca, filtros e ordenação
│   ├── products.js            # Renderização dos produtos
│   ├── filters.js             # Estado e regras de pesquisa/filtro
│   ├── catalog-page.js        # Estado da listagem, URL, drawer e paginação
│   ├── utils.js               # Funções puras e utilitários compartilhados
│   └── app.js                 # Inicialização e coordenação da interface
├── assets/
│   ├── images/products/       # Imagens locais demonstrativas
│   ├── icons/                 # Ícones e favicon próprios
│   ├── logo/                  # Variações de marca para a interface
│   └── logo.png               # Identidade visual original de referência
└── LICENSE
```

## Decisões de projeto

- **Mobile-first:** a experiência parte de uma coluna e evolui em `min-width`, mantendo alvos de toque confortáveis.
- **Design system:** tokens CSS concentram cor, tipografia de sistema, espaçamento, bordas, raios, sombras e transições. O laranja da identidade é reservado para marca e ações; creme, branco e grafite criam uma leitura editorial própria.
- **Componentização sem framework:** cards, chips, botões, campos e avisos têm classes independentes. O JavaScript é dividido por responsabilidade e usa módulos ES.
- **Home de catálogo:** a página inicial é formada por prateleiras editoriais independentes, ranking, faixas de preço, departamentos, recomendações e novidades. Em telas pequenas, as prateleiras usam rolagem horizontal; em telas maiores, aumentam progressivamente a quantidade de itens visíveis.
- **Dados opcionais:** preço, preço anterior, desconto, avaliação, total de avaliações, parcelamento e selo são tratados separadamente. O card não calcula nem inventa informações ausentes; simplesmente omite o campo.
- **Favoritos locais:** itens salvos ficam em `localStorage` e podem ser consultados em uma gaveta lateral. A funcionalidade não exige autenticação ou backend.
- **Catálogo escalável:** os dados ficam separados da interface. Cada produto possui identificador, categoria, preço, metadados, imagem e URL externa; uma API ou JSON pode substituir o arquivo local no futuro sem reescrever os componentes.
- **Acessibilidade:** HTML semântico, link de salto, foco visível, rótulos, mensagens dinâmicas com `aria-live`, navegação por teclado e suporte a redução de movimento.
- **Desempenho:** nenhum framework, fonte ou biblioteca externa; imagens locais leves, dimensões explícitas e carregamento tardio abaixo da dobra.
- **SEO:** título e descrição próprios, URL canônica preparada, Open Graph, dados estruturados e conteúdo editorial rastreável. O domínio canônico deve ser atualizado antes da publicação.
- **Transparência:** a interface informa que os links são de afiliado e que compra, pagamento e entrega acontecem no site parceiro. Links de oferta usam `rel="sponsored nofollow noopener"`.

## Fluxo da aplicação

1. `app.js` carrega os dados locais e inicializa os componentes.
2. `filters.js` mantém os filtros em memória e devolve uma lista derivada, sem alterar o catálogo original.
3. `products.js` transforma essa lista em marcação segura e atualiza a região de resultados.
4. Eventos são delegados a contêineres, evitando um listener por card e facilitando grandes catálogos.

## Arquitetura de dados dos produtos

`js/data.js` é a única fonte de dados do catálogo. Não há produto escrito manualmente no HTML: as prateleiras, resultados de busca, ranking, favoritos e listagem completa recebem os mesmos objetos e são renderizados por `js/products.js`.

Todos os registros atuais são fictícios e estão marcados individualmente com `developmentOnly: true`. O objeto `catalogMeta` também sinaliza que o arquivo contém dados de desenvolvimento.

### Contrato adotado

Campos obrigatórios:

- `id`: identificador interno estável e único;
- `slug`: identificador legível e único, preparado para URLs futuras;
- `name`: nome exibido do produto;
- `category`: ID de uma categoria cadastrada;
- `image`: imagem principal usada nas vitrines;
- `affiliateUrl`: destino externo da oferta;
- `createdAt`: data ISO usada para novidades e ordenação;
- `developmentOnly`: marca explícita para impedir que dados fictícios sejam confundidos com ofertas reais.

Campos opcionais:

- `shortDescription`, `description`, `subcategory` e `tags` enriquecem pesquisa e relacionados;
- `price`, `oldPrice`, `discount` e `installments` descrevem a oferta somente quando conhecidos;
- `rating` e `reviews` são independentes e podem existir separadamente;
- `badge` adiciona um selo editorial;
- `featured` controla a vitrine de destaques;
- `collections` associa o produto a seleções editoriais como `daily`, `popular`, `tech`, `home` e `beauty`;
- `imageAlt` descreve a imagem;
- `images` pode ser adicionado futuramente para uma galeria, mas não é necessário na HOME atual.

Não são calculados descontos, avaliações, preços ou parcelamentos ausentes. A interface simplesmente omite esses elementos.

### Adicionar um produto

Adicione um objeto ao array `products` em `js/data.js`. Nenhuma alteração no HTML é necessária.

```js
{
  id: "produto-001",
  slug: "nome-do-produto",
  name: "Nome do produto",
  category: "casa",
  image: "assets/images/products/produto.svg",
  imageAlt: "Descrição objetiva da imagem",
  affiliateUrl: "https://loja-parceira.example/produto",
  tags: ["casa", "organização"],
  featured: false,
  collections: ["daily", "home"],
  createdAt: "2026-10-04T10:00:00-03:00",
  developmentOnly: false
}
```

### API local reutilizável

`js/catalog.js` exporta funções puras que nunca alteram o array original:

- `findProductById` e `findProductBySlug`;
- `filterProductsByCategory`, `filterProductsByPrice`, `filterProductsByTags` e `filterProductsByCollection`;
- `searchProducts` e `sortProducts`;
- `getRelatedProducts`;
- `isNewProduct` e `getNewProducts`;
- `isFeaturedProduct` e `getFeaturedProducts`;
- `queryProducts`, para combinar busca, filtros e ordenação;
- `validateProduct` e `validateCatalog`, para detectar campos inválidos e IDs/slugs duplicados.

## Página de catálogo

`catalogo.html` combina pesquisa, filtros e ordenação sobre a API local. O painel permanece lateral a partir de 1024 px e vira um drawer acessível em telas menores. A listagem começa com 12 itens e usa “Carregar mais” para revelar os demais.

O estado é refletido na URL e pode ser compartilhado. Parâmetros aceitos:

- `q`, `categoria`, `subcategoria` e `collection`;
- `minPrice`, `maxPrice`, `minDiscount` e `minRating`;
- `tags` como lista separada por vírgulas;
- `featured=1`;
- `sort` com `relevance`, `newest`, `price-asc`, `price-desc`, `discount-desc` ou `rating-desc`;
- `page` para a quantidade já carregada.

Exemplo: `catalogo.html?categoria=tecnologia&maxPrice=100&sort=price-asc`.

## Executar localmente

Como o projeto usa módulos JavaScript, abra-o por um servidor HTTP local. Em um editor com servidor estático, sirva a raiz do projeto e acesse `index.html`. Não há instalação, compilação ou comando de build.

## Evolução prevista

- trocar os registros demonstrativos de `js/data.js` por catálogo real ou JSON local;
- adicionar ordenação, faixa de preço, paginação ou carregamento progressivo;
- criar páginas estáticas de categoria e detalhes editoriais;
- gerar `sitemap.xml`, `robots.txt` e URLs canônicas com o domínio definitivo;
- conectar uma fonte remota no futuro, mantendo a camada de apresentação independente.

> Os preços e produtos incluídos nesta base são demonstrativos. Antes de publicar, substitua imagens, valores e URLs pelos dados reais e valide as regras do programa de afiliados utilizado.
