import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./styles/main.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Función para leer productos desde localStorage
const readProductos = () => {
  try {
    const raw = localStorage.getItem("app_products");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export default function Carrito() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]); 
  const [total, setTotal] = useState(0);

  // Formatear precios
  const formatCurrency = (n) => "$" + Number(n).toLocaleString("es-CL");

  // Leer carrito del localStorage
  const readCart = () => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  // Guardar carrito en localStorage
  const writeCart = (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    const cnt = document.getElementById("contador");
    if (cnt) cnt.textContent = newCart.reduce((s, i) => s + (i.qty || 1), 0);
    setCart(newCart);
  };

  // Inicializar carrito
  useEffect(() => {
    setCart(readCart());
    const onStorage = (e) => {
      if (e.key === "cart") setCart(readCart());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Calcular total
  useEffect(() => {
    const productos = readProductos();
    let acc = 0;
    cart.forEach((item) => {
      const prod = productos.find((p) => p.id === item.id);
      if (prod) acc += prod.price * item.qty;
    });
    setTotal(acc);
  }, [cart]);

  // Cambiar cantidad
  const changeQty = (id, qty) => {
    qty = Math.max(1, Number(qty) || 1);
    const newCart = cart.map((c) => (c.id === id ? { ...c, qty } : c));
    writeCart(newCart);
  };

  // Eliminar producto
  const removeFromCart = (id) => {
    const newCart = cart.filter((c) => c.id !== id);
    writeCart(newCart);
  };

  // Vaciar carrito
  const clearCart = () => writeCart([]);

  const productos = readProductos(); // Productos actualizados

  return (
    <div id="page-wrapper" className="is-preload homepage">
      <div className="img-fondo">
        <div className="wrapper">
          <div className="container mt-4">
            <h1>Carrito</h1>

            <div id="cart-list" className="list-group mb-3">
              {cart.length === 0 ? (
                <div className="alert alert-info">El carrito está vacío.</div>
              ) : (
                cart.map((item) => {
                  const prod = productos.find((p) => p.id === item.id);
                  if (!prod) return null;
                  const qty = item.qty || 1;
                  const lineTotal = prod.price * qty;

                  return (
                    <div
                      key={item.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div className="d-flex align-items-center">
                        <img
                          src={prod.image}
                          alt={prod.title}
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                            marginRight: 12,
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: 600 }}>{prod.title}</div>
                          <div style={{ color: "#666" }}>
                            {formatCurrency(prod.price)}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center">
                        <input
                          type="number"
                          className="form-control"
                          style={{ width: 80, marginRight: 12 }}
                          min={1}
                          value={qty}
                          onChange={(e) => changeQty(item.id, e.target.value)}
                        />
                        <div
                          style={{
                            width: 120,
                            textAlign: "right",
                            marginRight: 12,
                          }}
                        >
                          {formatCurrency(lineTotal)}
                        </div>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <h4>
                Total: <span id="cart-total">{formatCurrency(total)}</span>
              </h4>
              <div>
                <button
                  id="clear-cart"
                  className="btn btn-secondary"
                  onClick={clearCart}
                >
                  Vaciar carrito
                </button>
                <button
                  id="checkout"
                  className="btn btn-primary ml-2"
                  onClick={() => alert("Proceder al pago (demo)")}
                >
                  Pagar
                </button>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <button
                className="btn btn-link"
                onClick={() => navigate("/productos")}
              >
                Seguir comprando
              </button>
              <Link to="/" className="btn btn-link">
                Ir al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


