import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

const navigateMock = vi.fn()
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => navigateMock,
  BrowserRouter: ({ children }) => <div>{children}</div>,
}))

import Home from '../src/Home'

test('botón "Ir a productos" llama a navigate con "/productos"', () => {
  render(<Home />)

  const boton = screen.getByRole('button', { name: 'Ir a productos' })
  fireEvent.click(boton)

  expect(navigateMock).toHaveBeenCalledWith('/productos')
})




