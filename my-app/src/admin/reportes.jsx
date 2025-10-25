import React, { useEffect, useState } from "react";
import usuariosEjemplo from "../utils/usuariosEjemplo";
import productosData from "../utils/productosData";
import { getBoletas } from "../utils/boletasData";

function formatCurrency(n) {
  if (n == null) return "$0";
  return "$" + Number(n).toLocaleString("es-CL");
}

function toCsv(rows) {
  return rows
    .map((r) =>
      r
        .map((v) => {
          if (v == null) return "";
          const s = String(v).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(",")
    )
    .join("\n");
}

function download(filename, content) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export default function Reportes() {
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [boletas, setBoletas] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    // Usuarios: localStorage "users" / "usuarios" o fallback usuariosEjemplo
    try {
      const rawUsers = localStorage.getItem("users") || localStorage.getItem("usuarios");
      if (rawUsers) setUsuarios(JSON.parse(rawUsers));
      else setUsuarios(usuariosEjemplo || []);
    } catch {
      setUsuarios(usuariosEjemplo || []);
    }

    // Productos: localStorage "productos" o fallback productosData
    try {
      const rawP = localStorage.getItem("productos") || localStorage.getItem("productos-admin");
      setProductos(rawP ? JSON.parse(rawP) : productosData || []);
    } catch {
      setProductos(productosData || []);
    }

    // Boletas: usar helper getBoletas (que revisa localStorage) o fallback
    try {
      const b = getBoletas();
      setBoletas(b || []);
    } catch {
      setBoletas([]);
    }
  }, []);

  const ventasFiltradas = boletas.filter((b) => {
    if (!b || !b.fecha) return true;
    if (!startDate && !endDate) return true;
    const f = new Date(b.fecha);
    if (startDate && f < new Date(startDate)) return false;
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (f > end) return false;
    }
    return true;
  });

  const totalVentas = ventasFiltradas.reduce((s, b) => s + (b.total || b.monto || 0), 0);
  const cantidadVentas = ventasFiltradas.length;

  function getClienteNombre(b) {
    if (!b) return "";
    if (typeof b.cliente === "string") return b.cliente;
    if (b.cliente && (b.cliente.nombre || b.cliente.apellido)) {
      return `${b.cliente.nombre || ""} ${b.cliente.apellido || ""}`.trim();
    }
    return b.nombre || b.usuario || "";
  }

  function exportVentasCsv() {
    const headers = ["id", "cliente", "email_cliente", "total", "fecha", "items"];
    const rows = [headers];
    ventasFiltradas.forEach((b) => {
      const itemsArr = b.productos || b.items || b.detalle || [];
      const items = itemsArr
        .map((it) => (it.titulo || it.nombre || it.title ? `${it.titulo || it.nombre || it.title} x${it.cantidad || it.qty || 1}` : JSON.stringify(it)))
        .join(" | ");
      const email =
        (b.cliente && (b.cliente.correo || b.cliente.email)) ||
        b.email ||
        (b.cliente && b.cliente.correo) ||
        "";
      rows.push([b.id || "", getClienteNombre(b), email, b.total || b.monto || "", b.fecha || "", items]);
    });
    download(`reportes_ventas_${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
  }

  function exportProductosCsv() {
    const headers = ["id", "titulo", "descripcion", "precio", "categoria", "stock"];
    const rows = [headers];
    productos.forEach((p) => {
      rows.push([
        p.id ?? "",
        p.title || p.titulo || p.nombre || p.name || "",
        p.description || p.descripcion || p.desc || "",
        p.price || p.precio || p.price || "",
        p.qty ?? p.stock ?? p.cantidad ?? "",
      ]);
    });
    download(`reportes_productos_${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
  }

  function exportUsuariosCsv() {
    const headers = ["id", "nombre", "email", "telefono", "region", "comuna", "cantidad_compras", "total_gastado"];
    const rows = [headers];
    usuarios.forEach((u) => {
      const compras = u.compras || u.ordenes || u.pedidos || [];
      const total = compras.reduce((s, c) => s + (c.price || c.total || c.monto || 0), 0);
      rows.push([u.id || "", u.nombre || u.name || "", u.email || u.correo || "", u.telefono || u.phone || "", u.region || "", u.comuna || "", compras.length, total]);
    });
    download(`reportes_usuarios_${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
  }

  // estilos: contenedor centrado y tarjetas con ancho máximo
  const outerStyle = { display: "flex", justifyContent: "center", padding: 20 };
  const containerStyle = { width: "100%", maxWidth: 1100 };
  const cardStyle = { margin: "12px auto", padding: 12, border: "1px solid #ddd", borderRadius: 6 };
  const controlsRow = { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "center" };
  const tableStyle = { width: "100%", borderCollapse: "collapse" };

  return (
    <div style={outerStyle}>
      <div style={containerStyle}>
        <h2 style={{ textAlign: "center", marginBottom: 12 }}>Reportes</h2>

        <section style={cardStyle}>
          <h3 style={{ textAlign: "center" }}>Ventas</h3>
          <div style={controlsRow}>
            <label>
              Desde: <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>
            <label>
              Hasta: <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>
            <button onClick={() => { setStartDate(""); setEndDate(""); }}>Limpiar</button>
            <button onClick={exportVentasCsv}>Exportar CSV Ventas</button>
          </div>

          <div style={{ marginTop: 12, textAlign: "center" }}>
            <strong>Total ventas:</strong> {formatCurrency(totalVentas)} &nbsp;|&nbsp; <strong>Cantidad:</strong> {cantidadVentas}
          </div>

          <div style={{ marginTop: 12 }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>ID</th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Cliente</th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Total</th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Fecha</th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Items</th>
                </tr>
              </thead>
              <tbody>
                {ventasFiltradas.map((b) => (
                  <tr key={b.id || Math.random()}>
                    <td style={{ padding: "6px 0" }}>{b.id}</td>
                    <td style={{ padding: "6px 0" }}>{getClienteNombre(b)}</td>
                    <td style={{ padding: "6px 0" }}>{formatCurrency(b.total || b.monto || 0)}</td>
                    <td style={{ padding: "6px 0" }}>{b.fecha}</td>
                    <td style={{ padding: "6px 0" }}>
                      {(b.productos || b.items || b.detalle || []).map((it) => it.titulo || it.nombre || it.title || "").join(", ")}
                    </td>
                  </tr>
                ))}
                {ventasFiltradas.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: "8px 0" }}>No se encontraron ventas en el rango.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section style={cardStyle}>
          <h3 style={{ textAlign: "center" }}>Productos</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            <button onClick={exportProductosCsv}>Exportar CSV Productos</button>
          </div>

          <div style={{ marginTop: 12 }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>ID</th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Titulo</th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Precio</th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Categoria</th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Stock</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id || Math.random()}>
                    <td style={{ padding: "6px 0" }}>{p.id}</td>
                    <td style={{ padding: "6px 0" }}>{p.title || p.titulo || p.nombre || p.name}</td>
                    <td style={{ padding: "6px 0" }}>{formatCurrency(p.price || p.precio)}</td>
                    <td style={{ padding: "6px 0" }}>{p.categoria || p.category || p.categoriaId}</td>
                    <td style={{ padding: "6px 0" }}>{p.qty ?? p.stock ?? p.cantidad ?? ""}</td>
                  </tr>
                ))}
                {productos.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: "8px 0" }}>No hay productos guardados.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section style={cardStyle}>
          <h3 style={{ textAlign: "center" }}>Usuarios</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            <button onClick={exportUsuariosCsv}>Exportar CSV Usuarios</button>
          </div>

          <div style={{ marginTop: 12 }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>ID</th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Nombre</th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Email</th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Compras</th>
                  <th style={{ borderBottom: "1px solid #ccc", textAlign: "left" }}>Total Gastado</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => {
                  const compras = u.compras || u.ordenes || [];
                  const total = compras.reduce((s, c) => s + (c.price || c.total || c.monto || 0), 0);
                  return (
                    <tr key={u.id || Math.random()}>
                      <td style={{ padding: "6px 0" }}>{u.id}</td>
                      <td style={{ padding: "6px 0" }}>{u.nombre || u.name}</td>
                      <td style={{ padding: "6px 0" }}>{u.email || u.correo}</td>
                      <td style={{ padding: "6px 0" }}>{compras.length}</td>
                      <td style={{ padding: "6px 0" }}>{formatCurrency(total)}</td>
                    </tr>
                  );
                })}
                {usuarios.length === 0 && (
                  <tr>
                    <td colSpan="5" style={{ padding: "8px 0" }}>No hay usuarios.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}