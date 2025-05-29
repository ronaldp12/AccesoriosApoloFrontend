import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import './ProfileLayout.css';
import imgUser from '../../../assets/icons/user.png';
import { useState } from 'react';
import { useContext } from 'react';
import { context } from '../../../Context/Context';
import { ConfirmModal } from '../../Ui/ConfirmModal/ConfirmModal';

export const ProfileLayout = () => {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const { name, handleLogout, avatar } = useContext(context);
    const location = useLocation();

    const [isConfirmLogoutOpen, setIsConfirmLogoutOpen] = useState(false);

    const openConfirmLogout = () => setIsConfirmLogoutOpen(true);
    const closeConfirmLogout = () => setIsConfirmLogoutOpen(false);

    return (
        <div className="profile-container">
            <div className="mobile-menu-icon" onClick={() => setShowMenu(!showMenu)}>
                {showMenu ? <X size={28} /> : <Menu size={28} />}
            </div>

            <aside className={`profile-sidebar ${showMenu ? 'show' : ''}`}>
                <div className="profile-user">
                    <img src={avatar || imgUser} alt="Usuario" className="profile-avatar" />
                    <h3>{name}</h3>
                </div>
                <nav className="profile-menu">
                    <button onClick={() => navigate('/profile')}
                        className={location.pathname === '/profile' ? 'active' : ''}
                    >Perfil
                    </button>
                    <button onClick={() => navigate('/profile/orders')}
                        className={location.pathname === '/profile/orders' ? 'active' : ''}
                    >Pedidos
                    </button>
                    <button onClick={() => navigate('/profile/wish-list')}
                        className={location.pathname === '/profile/wish-list' ? 'active' : ''}
                    >Lista de deseos
                    </button>

                    <button className='logout' onClick={ openConfirmLogout }
                    > <span><i className="bi bi-box-arrow-left"></i></span>Salir
                    </button>
                </nav>
            </aside>

            <main className="profile-content">
                <Outlet />
            </main>

            <ConfirmModal
                isOpen={isConfirmLogoutOpen}
                onClose={closeConfirmLogout}
                title="¿Cerrar sesión?"
                message="¿Estás seguro de que deseas cerrar tu sesión y salir del sistema?"
                confirmText="Salir"
                onConfirm={() => {
                    handleLogout();
                    navigate("/");
                }}
            />
        </div>
    );
};
