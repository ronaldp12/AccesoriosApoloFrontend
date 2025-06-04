import React from 'react';
import '../JoinBanner/JoinBanner.css';
import { context } from '../../../Context/Context.jsx';
import { useContext, useState } from 'react';
import { WelcomeNoLoginModal } from '../WelcomeNoLoginModal/WelcomeNoLoginModal.jsx';

export const JoinBanner = ({ onOpenRegister, onOpenLogin }) => {

    const { userLogin, nameRol } = useContext(context);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (userLogin) {
        return null;
    }

    const handleJoin = () => {
        if (userLogin && nameRol === 'cliente') {
            return null;
        } else {
            setIsModalOpen(true);
        }
    }

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleRegisterFromModal = () => {
        closeModal(); 
        if (onOpenRegister) {
            onOpenRegister(); 
        }
    };

    const handleLoginFromModal = () => {
        closeModal(); 
        if (onOpenLogin) {
            onOpenLogin();
        }
    };

    return (
        <section className="join-banner">
            <div className="join-content">
                <div className='join-now'>
                    <h2>ÚNETE </h2>
                    <h2 className="highlight">AHORA</h2>
                </div>
                <button onClick={handleJoin}>UNIRME</button>
            </div>

            <WelcomeNoLoginModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onOpenRegister={handleRegisterFromModal}
                onOpenLogin={handleLoginFromModal}
            />
        </section>
    );
};