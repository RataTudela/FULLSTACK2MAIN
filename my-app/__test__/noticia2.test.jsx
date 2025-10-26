import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Noticia from "../src/noticia2";

describe("Componente Noticia", () => {
  test("muestra titulo, descripcion, imagen y boton de volver al blog de la noticia 2", () => {
    render(
      <MemoryRouter>
        <Noticia />
      </MemoryRouter>
    );
    expect(
      screen.getByText(/Polémica en torno a Metal Gear Solid Δ: Snake Eater por su uso del Unreal Engine 5/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Además, jugadores señalaron que la iluminación, animaciones y texturas no reflejan el potencial de Unreal Engine 5, acusando a Konami de un “uso pobre” de la tecnología./i)
    ).toBeInTheDocument();

    const img = screen.getByAltText(/Metal Gear Solid Δ: Snake Eater en Unreal Engine 5/i);
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe("IMG");

    const boton = screen.getByRole("button", { name: /Volver al Blog/i });
    expect(boton).toBeInTheDocument();

    fireEvent.click(boton);
  });
});
