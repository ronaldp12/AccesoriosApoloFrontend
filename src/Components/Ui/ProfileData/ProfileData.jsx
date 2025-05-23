import React, { useContext, useEffect, useState } from 'react';
import './ProfileData.css';
import { context } from '../../../Context/Context';
import wheelIcon from "../../../assets/icons/img1-loader.png";

export const ProfileData = () => {
    const { token, isLoading, setIsLoading } = useContext(context);

    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});

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
                    setEditedData(data.usuario);
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

    const handleEditToggle = () => setIsEditing(!isEditing);

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

                {!isLoading && profileData && (
                    <>
                        <div className='container-user'>
                            <strong>Nombre</strong>
                            {isEditing ? (
                                <input type="text" name="nombre" value={editedData.nombre} onChange={handleInputChange} />
                            ) : (
                                <p><i>{profileData.nombre}</i></p>
                            )}
                        </div>

                        <div className='container-user'>
                            <strong>Cédula de ciudadanía</strong>
                            {isEditing ? (
                                <input type="text" name="cedula" value={editedData.cedula} onChange={handleInputChange} />
                            ) : (
                                <p>{profileData.cedula}</p>
                            )}
                        </div>

                        <div className='container-user'>
                            <strong>Correo</strong>
                            {isEditing ? (
                                <input type="email" name="correo" value={editedData.correo} onChange={handleInputChange} />
                            ) : (
                                <p><i>{profileData.correo}</i></p>
                            )}
                        </div>

                        <div className='container-user'>
                            <strong>Teléfono</strong>
                            {isEditing ? (
                                <input type="text" name="telefono" value={editedData.telefono} onChange={handleInputChange} />
                            ) : (
                                <p><i>{profileData.telefono}</i></p>
                            )}
                        </div>

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
