import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Productos from '../src/Productos';

describe('Componente Productos', () => {
  test('renderiza productos y categorías', () => {
    render(
      <MemoryRouter>
        <Productos />
      </MemoryRouter>
    );
    expect(screen.getByText(/Productos/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Todos/i })).toBeInTheDocument();

    const productos = screen.getAllByRole('img');
    expect(productos.length).toBeGreaterThan(0);
  });
});
