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
  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false); // nuevo modal de confirmación
  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    calle: "",
    departamento: "",
    region: "",
    comuna: "",
    indicaciones: "",
    pago: 0,
  });

  const productos = readProductos();
  const formatCurrency = (n) => "$" + Number(n).toLocaleString("es-CL");

  // Leer carrito
  const readCart = () => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const writeCart = (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
    const cnt = document.getElementById("contador");
    if (cnt) cnt.textContent = newCart.reduce((s, i) => s + (i.qty || 1), 0);
    setCart(newCart);
  };

  useEffect(() => {
    setCart(readCart());
    const onStorage = (e) => {
      if (e.key === "cart") setCart(readCart());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    let acc = 0;
    cart.forEach((item) => {
      const prod = productos.find((p) => p.id === item.id);
      if (prod) acc += prod.price * item.qty;
    });
    setTotal(acc);
  }, [cart]);

  const changeQty = (id, qty) => {
    qty = Math.max(1, Number(qty) || 1);
    const newCart = cart.map((c) => (c.id === id ? { ...c, qty } : c));
    writeCart(newCart);
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter((c) => c.id !== id);
    writeCart(newCart);
  };

  const clearCart = () => writeCart([]);

  const handlePago = (e) => {
    e.preventDefault();

    // Validar monto exacto
    if (Number(cliente.pago) !== total) {
      setErrorModal(true);
      return;
    }

    const nuevaOrden = {
      id: Date.now(),
      fecha: new Date().toISOString(),
      cliente: { ...cliente },
      productos: cart.map((item) => {
        const prod = productos.find((p) => p.id === item.id);
        return {
          id: item.id,
          title: prod.title,
          qty: item.qty,
          price: prod.price,
        };
      }),
      total,
    };

    const ordenesPrevias = JSON.parse(localStorage.getItem("ordenes")) || [];
    localStorage.setItem(
      "ordenes",
      JSON.stringify([nuevaOrden, ...ordenesPrevias])
    );

    setShowModal(false);
    setSuccessModal(true); // mostrar confirmación
    clearCart();
    setCliente({
      nombre: "",
      apellido: "",
      correo: "",
      calle: "",
      departamento: "",
      region: "",
      comuna: "",
      indicaciones: "",
      pago: 0,
    });
  };

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
                      className="list-group-item d-flex justify-content-between align-items-center flex-wrap"
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

                      <div className="d-flex align-items-center mt-2 mt-md-0">
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

            <div className="mb-3">
              <h4>
                Total: <span id="cart-total">{formatCurrency(total)}</span>
              </h4>
              <button
                className="btn btn-secondary w-100 mt-2 mb-2"
                onClick={clearCart}
                disabled={cart.length === 0}
              >
                Vaciar Carrito
              </button>
              <button
                className="btn btn-primary w-100 mt-2"
                onClick={() => setShowModal(true)}
                disabled={cart.length === 0}
              >
                Pagar
              </button>
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

      {/* Modal de pago */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", overflowY: "auto" }}
        >
          <div className="modal-dialog modal-dialog-scrollable modal-lg">
            <form className="modal-content" onSubmit={handlePago}>
              <div className="modal-header">
                <h5 className="modal-title">Datos para el pago</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                <h6>Productos en el carrito:</h6>
                <ul>
                  {cart.map((item) => {
                    const prod = productos.find((p) => p.id === item.id);
                    if (!prod) return null;
                    return (
                      <li key={item.id}>
                        {prod.title} - {item.qty} x {formatCurrency(prod.price)}
                      </li>
                    );
                  })}
                </ul>

                <h6 className="mt-2">Total a pagar: {formatCurrency(total)}</h6>

                <h6 className="mt-3">Datos del cliente:</h6>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nombre"
                      value={cliente.nombre}
                      onChange={(e) =>
                        setCliente({ ...cliente, nombre: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Apellido"
                      value={cliente.apellido}
                      onChange={(e) =>
                        setCliente({ ...cliente, apellido: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-12 mb-2">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Correo"
                      value={cliente.correo}
                      onChange={(e) =>
                        setCliente({ ...cliente, correo: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-12 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Calle"
                      value={cliente.calle}
                      onChange={(e) =>
                        setCliente({ ...cliente, calle: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Departamento"
                      value={cliente.departamento}
                      onChange={(e) =>
                        setCliente({ ...cliente, departamento: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Región"
                      value={cliente.region}
                      onChange={(e) =>
                        setCliente({ ...cliente, region: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Comuna"
                      value={cliente.comuna}
                      onChange={(e) =>
                        setCliente({ ...cliente, comuna: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-2">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Indicaciones"
                      value={cliente.indicaciones}
                      onChange={(e) =>
                        setCliente({ ...cliente, indicaciones: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-md-12 mb-2">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Monto ingresado"
                      value={cliente.pago}
                      onChange={(e) =>
                        setCliente({ ...cliente, pago: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirmar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de error */}
      {errorModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", overflowY: "auto" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Error</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setErrorModal(false)}
                />
              </div>
              <div className="modal-body">
                <p>
                  El monto ingresado no coincide con el total a pagar:{" "}
                  {formatCurrency(total)}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setErrorModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de éxito */}
      {successModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", overflowY: "auto" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Pago exitoso</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSuccessModal(false)}
                />
              </div>
              <div className="modal-body">
                <p>Su pago fue confirmado. ¡Gracias por su compra!</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={() => setSuccessModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



