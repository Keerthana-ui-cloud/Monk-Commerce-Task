// src/data/mockProducts.js

const mockProducts = [
  {
    id: 1,
    title: "Hat Classic",
    image: { src: "https://via.placeholder.com/48?text=Hat+Classic" },
    variants: [
      { id: 11, title: "Small", discount: 20, available:99 },
      { id: 12, title: "Medium", discount: 25, available:99 },
    ],
  },
  {
    id: 2,
    title: "Hat Modern",
    image: { src: "https://via.placeholder.com/48?text=Hat+Modern" },
    variants: [
      { id: 21, title: "Small", discount: 22, available:99 },
      { id: 22, title: "Medium", discount: 28, available:99 },
      { id: 23, title: "Large", discount: 35, available:90 },
    ],
  },
  {
    id: 3,
    title: "Cap Retro",
    image: { src: "https://via.placeholder.com/48?text=Cap+Retro" },
    variants: [
      { id: 31, title: "One Size", discount: 15, available:99 },
    ],
  },
];

export default mockProducts;
