import { useCart } from './hooks/useCart';
import { products } from './data/products';
import ProductList from './components/ProductList';
import CartSummary from './components/CartSummary';
import Checkout from './components/Checkout';

function App() {
  const { items, addToCart, removeFromCart, updateQuantity, totalAmount } = useCart();

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-600">Shop</h1>
      <ProductList products={products} onAddToCart={addToCart} />
      <CartSummary
        items={items}
        totalAmount={totalAmount}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
      />
      <Checkout amount={totalAmount} />
    </div>
  );
}

export default App;