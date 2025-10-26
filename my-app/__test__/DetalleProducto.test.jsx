import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DetalleProducto from "/src/DetalleProducto";

test("renderiza el detalle del producto usando id page-wrapper", () => {
  render(
    <MemoryRouter initialEntries={["/detalle-producto/0"]}>
      <Routes>
        <Route path="/detalle-producto/:index" element={<DetalleProducto />} />
      </Routes>
    </MemoryRouter>
  );

  const contenedor = document.querySelector("#page-wrapper");
  expect(contenedor).toBeInTheDocument();
});


