import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Contacto from "../src/contacto";

beforeEach(() => {
  localStorage.clear();
});

test("envia un mensaje y lo guarda en localStoragem, ademas de verificar que el correo termine en @duocuc.cl", () => {
  render(<Contacto />);

  const nombreInput = screen.getByLabelText(/Nombre Completo/i);
  const emailInput = screen.getByLabelText(/Correo/i);
  const textoInput = screen.getByLabelText(/Comentario/i);
  const botonEnviar = screen.getByText(/Enviar Mensaje/i);

  fireEvent.change(nombreInput, { target: { value: "Juan" } });
  fireEvent.change(emailInput, { target: { value: "juan@duocuc.cl" } });
  fireEvent.change(textoInput, { target: { value: "Testeando" } });
  fireEvent.click(botonEnviar);

  expect(screen.getByText(/Mensaje enviado correctamente/i)).toBeInTheDocument();

  const contactosGuardados = JSON.parse(localStorage.getItem("contactos"));
  expect(contactosGuardados.length).toBe(1);
  expect(contactosGuardados[0].nombre).toBe("Juan");
});
