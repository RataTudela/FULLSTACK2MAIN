import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}))

import Registro from '../src/Registro'

test('Cambiar estado inputs al rellenarlos', () => {
  render(<Registro />)

  const inputNombre = screen.getByLabelText('Nombre Completo')
  const inputEmail = screen.getByLabelText('Correo')
  const inputContraseña = screen.getByLabelText('Contraseña')
  const inputConfirmar = screen.getByLabelText('Confirmar Contraseña')
  const inputTelefono = screen.getByLabelText('Teléfono')
  const inputRegion = screen.getByLabelText('Región')
  const inputComuna = screen.getByLabelText('Comuna')

  fireEvent.change(inputNombre, { target: { value: 'Ana' } })
  fireEvent.change(inputEmail, { target: { value: 'ana@test.com' } })
  fireEvent.change(inputContraseña, { target: { value: '123456' } })
  fireEvent.change(inputConfirmar, { target: { value: '123456' } })
  fireEvent.change(inputTelefono, { target: { value: '123456789' } })
  fireEvent.change(inputRegion, { target: { value: 'Región X' } })
  fireEvent.change(inputComuna, { target: { value: 'Comuna Y' } })

  expect(inputNombre.value).toBe('Ana')
  expect(inputEmail.value).toBe('ana@test.com')
  expect(inputContraseña.value).toBe('123456')
  expect(inputConfirmar.value).toBe('123456')
  expect(inputTelefono.value).toBe('123456789')
  expect(inputRegion.value).toBe('Región X')
  expect(inputComuna.value).toBe('Comuna Y')
})


