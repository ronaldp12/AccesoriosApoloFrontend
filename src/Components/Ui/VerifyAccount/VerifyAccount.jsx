import React, { useState } from "react";
import "../../Ui/VerifyAccount/VerifyAccount.css";
import { Logo } from "../../Ui/Logo/Logo";

export const VerifyAccount = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`).focus();
      }
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-header">
        <button className="back-btn"><i className="hgi hgi-stroke hgi-arrow-left-01"></i></button>
        <Logo />
      </div>

      <h1 className="verify-title">Verifica tu <span>Cuenta</span></h1>

      <p className="verify-text">
        Hemos enviado un código de verificación a tu correo electrónico: <b>ju***@gmail.com</b>
      </p>

      <p className="verify-instructions">Introduce el código de 6 dígitos enviado</p>

      <div className="code-inputs">
        {code.map((digit, index) => (
          <input
            key={index}
            id={`code-${index}`}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleInputChange(e, index)}
          />
        ))}
      </div>

      <p className="resend-text">Reenviar código en <b>30 segundos</b></p>

      <button className="verify-btn">VERIFICAR</button>

      <p className="change-email">
        ¿Es incorrecto tu correo? <a href="#">Cambiar Correo</a>
      </p>
    </div>
  );
};
