import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Noticia from "../src/noticia1";

describe("Componente Noticia", () => {
  test("muestra titulo, descripcion, imagen y boton de volver al blog de la noticia 1", () => {
    render(
      <MemoryRouter>
        <Noticia />
      </MemoryRouter>
    );
    expect(
      screen.getByText(/Colapso en tiendas digitales tras el lanzamiento de Hollow Knight: Silksong/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/La comunidad llevaba años aguardando la llegada del juego/i)
    ).toBeInTheDocument();

    const img = screen.getByAltText(/Colapso en tiendas digitales tras el lanzamiento de Silksong/i);
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe("IMG");

    const boton = screen.getByRole("button", { name: /Volver al Blog/i });
    expect(boton).toBeInTheDocument();

    fireEvent.click(boton);
  });
});
