
import { api } from "../services/api";

export default function Checkout() {
  const pay = async () => {
    const orderId = await api("/api/payment/create", {
      method: "POST",
      body: JSON.stringify({ totalAmount: 100 })
    });
    alert("Order created: " + orderId);
  };

  return (
    <div>
      <h2>Checkout</h2>
      <button onClick={pay}>Create Payment</button>
    </div>
  );
}
