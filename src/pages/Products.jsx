
import { api } from "../services/api";
import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api("/api/products").then(setProducts);
  }, []);

  const add = (id) => api("/api/cart/add", {
    method: "POST",
    body: JSON.stringify({ productId: id, quantity: 1 })
  });

  return (
    <div>
      <h2>Products</h2>
      <a href="/cart">Cart</a>
      {products.map(p => (
        <div key={p.productId}>
          <b>{p.name}</b> - ₹{p.price}
          <button onClick={()=>add(p.productId)}>Add</button>
        </div>
      ))}
    </div>
  );
}
