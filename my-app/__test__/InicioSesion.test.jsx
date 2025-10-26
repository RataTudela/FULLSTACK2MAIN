import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}))

import InicioSesion from '../src/InicioSesion'

test('cambiar el estado de los inputs al escribir', () => {
  render(<InicioSesion />)

  const inputEmail = screen.getByLabelText('Correo')
  const inputPassword = screen.getByLabelText('Contraseña')

  fireEvent.change(inputEmail, { target: { value: 'usuario@test.com' } })
  fireEvent.change(inputPassword, { target: { value: '123456' } })

  expect(inputEmail.value).toBe('usuario@test.com')
  expect(inputPassword.value).toBe('123456')
})
