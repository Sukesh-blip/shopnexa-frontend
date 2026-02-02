
import { api } from "../services/api";
import { useEffect, useState } from "react";

export default function Cart() {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    api("/api/cart/items").then(setCart);
  }, []);

  if (!cart) return null;

  return (
    <div>
      <h2>Cart</h2>
      {cart.cart.products.map(p => (
        <div key={p.product_id}>
          {p.name} x {p.quantity} = ₹{p.total_price}
        </div>
      ))}
      <h3>Total: ₹{cart.cart.overall_total_price}</h3>
      <a href="/checkout">Checkout</a>
    </div>
  );
}
