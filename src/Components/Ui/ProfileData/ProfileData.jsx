import React, { useContext, useEffect, useState } from 'react';
import './ProfileData.css';
import { context } from '../../../Context/Context';
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const ProfileData = () => {
    const { token, isLoading, setIsLoading, getErrorMessage, validatePassword } = useContext(context);

    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswordValidation, setShowPasswordValidation] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(""), 1500);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(""), 1500);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    useEffect(() => {
        if (!token) return;

        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://accesoriosapolobackend.onrender.com/perfil', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include'
                });

                const data = await response.json();

                if (response.ok) {
                    setProfileData(data.usuario);
                    setEditedData({
                        nombre: data.usuario.nombre || '',
                        cedula: data.usuario.cedula || '',
                        telefono: data.usuario.telefono || '',
                        contrasena: data.usuario.contrasena || ''
                    });
                } else {
                    console.error(data.mensaje);
                }
            } catch (error) {
                console.error('Error al obtener perfil:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const handleInputChange = (e) => {
        setEditedData({
            ...editedData,
            [e.target.name]: e.target.value
        });
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        if (!isEditing) {
            setEditedData(prev => ({
                ...prev,
                contrasena: ''
            }));
            setConfirmPassword('');
            setShowPasswordValidation(false);
        }
    };

    const handlePasswordFocus = () => {
        setShowPasswordValidation(true);
    };

    const handlePasswordBlur = () => {
        // Ocultar validaciones al perder el foco
        setShowPasswordValidation(false);
    };
    const passwordsMatch = () => {
        return editedData.contrasena === confirmPassword;
    };

    const isPasswordValid = () => {
        const validation = validatePassword(editedData.contrasena || '');
        return validation.length && validation.uppercase && validation.number;
    };

    const handleSave = async () => {
        if (!token) return;

        if (isEditing && editedData.contrasena) {
            if (!isPasswordValid()) {
                setErrorMessage("La contraseña no cumple con los requisitos.");
                return;
            }

            if (!passwordsMatch()) {
                setErrorMessage("Las contraseñas no coinciden.");
                return;
            }
        }

        setIsLoading(true);
        try {
            const response = await fetch('https://accesoriosapolobackend.onrender.com/editar-perfil', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(editedData)
            });

            const result = await response.json();

            if (response.ok) {
                setSuccessMessage("Información editada con éxito.");
                setProfileData(prev => ({
                    ...prev,
                    ...editedData
                }));
                setIsEditing(false);
                setConfirmPassword(''); 
                setShowPasswordValidation(false); 
            } else {
                setErrorMessage(getErrorMessage(result, "Error al editar información."));
            }
        } catch (error) {
            console.error('Error al guardar perfil:', error);
            setErrorMessage("Hubo un error al editar información.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="profile-content">
            <h2>Perfil</h2>
            <div className="profile-details">
                {isLoading && (
                    <div className="profile-data-loader">
                        <img src={wheelIcon} alt="Cargando..." className="profile-data-spinner" />
                        <p className="profile-loading-text">Cargando perfil...</p>
                    </div>
                )}

                {successMessage && (
                    <div className="alert-profile-data success">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="alert-profile-data error">
                        {errorMessage}
                    </div>
                )}

                {!isLoading && profileData && (
                    <>
                        <div className='container-user'>
                            <strong>Nombre</strong>
                            {isEditing ? (
                                <input type="text" name="nombre" value={editedData.nombre || ''} onChange={handleInputChange} />
                            ) : (
                                <p><i>{profileData.nombre}</i></p>
                            )}
                        </div>

                        <div className='container-user'>
                            <strong>Cédula de ciudadanía</strong>
                            {isEditing ? (
                                <input type="text" name="cedula" value={editedData.cedula || ''} onChange={handleInputChange} />
                            ) : (
                                <p>{profileData.cedula}</p>
                            )}
                        </div>

                        <div className='container-user'>
                            <strong>Correo</strong>
                            <p><i>{profileData.correo}</i></p>
                        </div>

                        <div className='container-user'>
                            <strong>Teléfono</strong>
                            {isEditing ? (
                                <input type="text" name="telefono" value={editedData.telefono || ''} onChange={handleInputChange} />
                            ) : (
                                <p><i>{profileData.telefono}</i></p>
                            )}
                        </div>

                        <div className='container-user'>
                            <strong>Contraseña</strong>
                            {isEditing ? (
                                <>
                                    <input
                                        type="password"
                                        name="contrasena"
                                        value={editedData.contrasena || ''}
                                        onChange={handleInputChange}
                                        onFocus={handlePasswordFocus}
                                        onBlur={handlePasswordBlur}
                                        placeholder="Nueva contraseña"
                                    />

                                    {showPasswordValidation && (
                                        <div className="password-conditions">
                                            {!validatePassword(editedData.contrasena || '').length && <p>○ Debe tener al menos 8 caracteres</p>}
                                            {!validatePassword(editedData.contrasena || '').uppercase && <p>○ Debe contener una letra mayúscula</p>}
                                            {!validatePassword(editedData.contrasena || '').number && <p>○ Debe contener al menos un número</p>}
                                            {editedData.contrasena && isPasswordValid() && (
                                                <p className="valid-password-change">Contraseña válida <i className="bi bi-check-circle"></i></p>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p><i>********</i></p>
                            )}
                        </div>

                        {isEditing && (
                            <div className='container-user'>
                                <strong>Confirmar Contraseña</strong>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    placeholder="Confirmar nueva contraseña"
                                />

                                {confirmPassword && (
                                    <div className="password-match-validation">
                                        {passwordsMatch() ? (
                                            <p className="passwords-match">Las contraseñas coinciden <i className="bi bi-check-circle"></i></p>
                                        ) : (
                                            <p className="passwords-no-match">Las contraseñas no coinciden</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className='container-button'>
                            {isEditing ? (
                                <button className="edit-button" onClick={handleSave}>GUARDAR</button>
                            ) : (
                                <button className="edit-button" onClick={handleEditToggle}>EDITAR</button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};