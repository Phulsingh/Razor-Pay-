import type { Product } from '../types/product';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export default function ProductList({ products, onAddToCart }: ProductListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 p-5">
      {products.map((product) => (
        <div
          key={product.id}
          className="border  border-gray-200 rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-md mb-2"
          />
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{product.description}</p>
          <p className="font-bold mb-3">₹{product.price}</p>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-blue-600  cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}