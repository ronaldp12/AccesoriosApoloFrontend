import React, { useState, useEffect, useContext } from "react";
import "../../Ui/VerifyAccount/VerifyAccount.css";
import { Logo } from "../../Ui/Logo/Logo";
import { useSearchParams } from "react-router-dom";
import img1 from "../../../assets/images/img1-auth.png";
import { WelcomeModal } from "../../Layouts/WelcomeModal/WelcomeModal";
import { NavLink } from "react-router-dom";
import { context } from "../../../Context/Context";
import wheelIcon from "../../../assets/icons/img1-loader.png"

export const VerifyAccount = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");
    const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
    const { setUserLogin, setToken, setName, isLoading, setIsLoading } = useContext(context);

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

    const handleVerifyCode = async () => {
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:3000/verificar-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ correo: email, codigo: code.join("") })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Código verificado correctamente");

                setUserLogin(data.usuario.nombre);
                setToken(data.token);
                setName(data.usuario.nombre);

                localStorage.setItem("token", data.token);
                localStorage.setItem("usuarioLogueado", data.usuario.nombre);

                setIsWelcomeOpen(true);
            } else {
                alert(data.mensaje || "Código incorrecto, intenta de nuevo.");
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Error al verificar código:", error);
            alert("Ocurrió un error al verificar el código.");
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        try {
            const response = await fetch("http://localhost:3000/reenviar-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ correo: email })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Respuesta del servidor:", errorText);
                throw new Error(`Error ${response.status}`);
            }

            const data = await response.json();
            console.log(data.message);
            setSeconds(30);
            setCanResend(false);

        } catch (error) {
            console.error("Error en la petición de reenviar OTP:", error);
        }
    };

    return (
        <div className="verify-container">
            <div className="verify-header">

                <NavLink to="/">
                    <button className="back-btn">
                        <iconify-icon icon="fluent:ios-arrow-24-filled" className="arrow-back" />
                    </button>
                </NavLink>

                <Logo />
            </div>

            <div className="verify-title">
                <h1>Verifica tu <span>Cuenta</span>
                    <img src={img1} alt="img1-auth" />
                </h1>
            </div>

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
                    <button className="resend-btn" onClick={handleResendCode}>
                        Reenviar código
                    </button>
                ) : (
                    <>Reenviar código en <b>{seconds} segundos</b></>
                )}
            </p>

            <button className="verify-btn" onClick={handleVerifyCode}>
                {isLoading ? (
                    <img src={wheelIcon} alt="Cargando..." className="verify-spinner" />
                ) : (
                    <span>Verificar</span>
                )}
            </button>

            <p className="change-email">
                ¿Es incorrecto tu correo? <a href="#">Cambiar Correo</a>
            </p>

            <WelcomeModal isOpen={isWelcomeOpen} onClose={() => setIsWelcomeOpen(false)} />
        </div>
    );
};
