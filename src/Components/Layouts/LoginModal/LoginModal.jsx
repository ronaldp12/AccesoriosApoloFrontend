import React, { useContext, useState } from "react";
import "./LoginModal.css";
import { context } from "../../../Context/Context.jsx";
import iconGoogle from "../../../assets/icons/google.png";
import iconFacebook from "../../../assets/icons/facebook.png";

export const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { setUserLogin, setToken, setName } = useContext(context); 
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      });

      const data = await response.json();

      if (response.ok) {
        
        setUserLogin(data.usuario.nombre);
        setToken(data.token);
        setName(data.usuario.nombre);
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuarioLogueado", data.usuario.nombre);

        onClose(); 
        onLoginSuccess(); 
      } else {
        alert(data.mensaje);
      }
    } catch (error) {
      console.error("Error en login:", error);
      alert("Hubo un error al iniciar sesión");
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`}>
      <div className={`login-modal-box ${isOpen ? "active" : ""}`}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="modal-form-container">
          <h2>INICIAR SESIÓN</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <div className="input-field">
                <label>Correo *</label>
                <input
                  type="email"
                  placeholder="example@example.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
              <div className="input-field">
                <label>Contraseña *</label>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                />
                <u>¿Olvidaste tu contraseña?</u>
              </div>
            </div>

            <div className="group-bottom">
              <button type="submit" className="submit-btn">
                <span>Iniciar Sesión</span>
              </button>

              <div className="divider">o</div>

              <div className="social-icons">
                <button type="button" className="social facebook">
                  <img src={iconFacebook} alt="facebook" />
                </button>
                <span className="divider-vertical"></span>
                <button type="button" className="social google">
                  <img src={iconGoogle} alt="google" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
