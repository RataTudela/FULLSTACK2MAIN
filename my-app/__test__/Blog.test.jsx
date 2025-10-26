import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Blog from "../src/Blog";

test("Verifica la existencia de botones Ver Caso y que se muestren la noticias", () => {
  render(
    <MemoryRouter>
      <Blog />
    </MemoryRouter>
  );

  expect(
    screen.getByText(/Colapso en tiendas digitales tras el lanzamiento de Hollow Knight: Silksong/i)
  ).toBeInTheDocument();

  expect(
    screen.getByText(/Polémica en torno a Metal Gear Solid Δ: Snake Eater por su uso del Unreal Engine 5/i)
  ).toBeInTheDocument();

  expect(screen.getAllByRole("button", { name: /VER CASO/i }).length).toBe(2);
});
