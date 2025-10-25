import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validarRegistro } from "./utils/validaciones"; 
import "./styles/CssRegistro.css";
import "./styles/main.css";

export default function Registro() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [telefono, setTelefono] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");

  const [nombreError, setNombreError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contraseñaError, setContraseñaError] = useState("");
  const [confirmarContraseñaError, setConfirmarContraseñaError] = useState("");
  const [telefonoError, setTelefonoError] = useState("");
  const [regionError, setRegionError] = useState("");
  const [comunaError, setComunaError] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState("");

  const handleSubmit = (event) => {
    const valid = validarRegistro(
      event,
      nombre,
      email,
      contraseña,
      confirmarContraseña,
      telefono,
      region,
      comuna,
      setNombreError,
      setEmailError,
      setContraseñaError,
      setConfirmarContraseñaError,
      setTelefonoError,
      setRegionError,
      setComunaError,
      setRegistroExitoso
    );

    if (valid) {
      setNombre("");
      setEmail("");
      setContraseña("");
      setConfirmarContraseña("");
      setTelefono("");
      setRegion("");
      setComuna("");

      setTimeout(() => navigate("/inicio-sesion"), 1000);
    }
  };

  return (
    <main className="img-fondo">
      <div className="login-box">
        <div>
          <img src="src/images/Logo_de_GameCloud.png" alt="Logo de GameCloud" />
        </div>
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombre">Nombre Completo</label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {nombreError && <div className="fore-text">{nombreError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <div className="fore-text">{emailError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="contraseña">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
            />
            {contraseñaError && <div className="fore-text">{contraseñaError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmarContraseña">Confirmar Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="confirmarContraseña"
              value={confirmarContraseña}
              onChange={(e) => setConfirmarContraseña(e.target.value)}
            />
            {confirmarContraseñaError && (
              <div className="fore-text">{confirmarContraseñaError}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              type="number"
              className="form-control"
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            {telefonoError && <div className="fore-text">{telefonoError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="region">Región</label>
            <input
              type="text"
              className="form-control"
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            />
            {regionError && <div className="fore-text">{regionError}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="comuna">Comuna</label>
            <input
              type="text"
              className="form-control"
              id="comuna"
              value={comuna}
              onChange={(e) => setComuna(e.target.value)}
            />
            {comunaError && <div className="fore-text">{comunaError}</div>}
          </div>

          <button type="submit" className="btn btn-primary">
            Registrarse
          </button>

          {registroExitoso && (
            <div className="success-text" style={{ marginTop: "10px", color: "green" }}>
              {registroExitoso}
            </div>
          )}

          <div>
            <a
              onClick={() => navigate("/inicio-sesion")}
              style={{
                cursor: "pointer",
                textAlign: "center",
                display: "block",
                marginTop: "10px",
              }}
            >
              ¿Ya tienes cuenta? Inicia sesión aquí
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
