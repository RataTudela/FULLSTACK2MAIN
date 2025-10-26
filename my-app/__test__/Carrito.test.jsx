import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Carrito from "../src/Carrito";

beforeEach(() => {
  localStorage.clear();
});

test("muestra mensaje de carrito vacío", () => {
  render(
    <MemoryRouter>
      <Carrito />
    </MemoryRouter>
  );

  expect(screen.getByText(/El carrito está vacío/i)).toBeInTheDocument();
});

