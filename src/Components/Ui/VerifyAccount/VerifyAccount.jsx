import React, { useState } from "react";
import "../../Ui/VerifyAccount/VerifyAccount.css";
import { Logo } from "../../Ui/Logo/Logo";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export const VerifyAccount = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);

    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");

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

    const formatEmail = (email) => {
        if (!email) return "";
        const [user, domain] = email.split("@");
        const visiblePart = user.slice(0, 2);
        return `${visiblePart}***@${domain}`;
    };

    const [seconds, setSeconds] = useState(30);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (seconds > 0) {
            const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [seconds]);


    return (
        <div className="verify-container">
            <div className="verify-header">
                <button className="back-btn"><i className="hgi hgi-stroke hgi-arrow-left-01"></i></button>
                <Logo />
            </div>

            <h1 className="verify-title">Verifica tu <span>Cuenta</span></h1>

            <p className="verify-text">
                Hemos enviado un código de verificación a tu correo electrónico: <b>{formatEmail(email)}</b>
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

            <p className="resend-text">
                {canResend ? (
                    <button className="resend-btn" onClick={() => {
                        setSeconds(30);
                        setCanResend(false);
                        
                    }}>Reenviar código</button>
                ) : (
                    <>Reenviar código en <b>{seconds} segundos</b></>
                )}
            </p>

            <button className="verify-btn">VERIFICAR</button>

            <p className="change-email">
                ¿Es incorrecto tu correo? <a href="#">Cambiar Correo</a>
            </p>
        </div>
    );
};
