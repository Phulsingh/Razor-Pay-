import type { CartItem } from '../hooks/useCart';

interface CartSummaryProps {
  items: CartItem[];
  totalAmount: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartSummary({
  items,
  totalAmount,
  onUpdateQuantity,
  onRemove,
}: CartSummaryProps) {
  if (items.length === 0) {
    return <p className="text-center text-gray-500 mt-6">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-md mx-auto my-5 p-4 border border-gray-200 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-3">Cart</h3>
      {items.map((item) => (
        <div
          key={item.product.id}
          className="flex justify-between items-center mb-3"
        >
          <span>{item.product.name}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
              className="w-7 h-7 border rounded hover:bg-gray-100"
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
              className="w-7 h-7 border rounded hover:bg-gray-100"
            >
              +
            </button>
            <span className="font-medium w-16 text-right">
              ₹{item.product.price * item.quantity}
            </span>
            <button
              onClick={() => onRemove(item.product.id)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
      <hr className="my-3" />
      <h3 className="text-lg font-bold">Total: ₹{totalAmount}</h3>
    </div>
  );
}