import type { Product } from '../types/product';

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Mouse',
    price: 799,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    description: 'Ergonomic wireless mouse with USB receiver.',
  },
  {
    id: 'p2',
    name: 'Mechanical Keyboard',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop',
    description: 'RGB backlit mechanical keyboard.',
  },
  {
    id: 'p3',
    name: 'USB-C Hub',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop',
    description: '6-in-1 USB-C hub with HDMI and card reader.',
  },
];