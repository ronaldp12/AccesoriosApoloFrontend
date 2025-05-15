import "../Trunk/Trunk.css";

export const Trunk = ({ isOpen, onClose }) => {
    return (
        <div className={`drawer-trunk ${isOpen ? 'open' : ''}`}>
            <div className="drawer-header">
                <h2>MI MALETERO</h2>
                <button className="close-button" onClick={onClose}>×</button>
            </div>
            <div className="drawer-content">
                <p>NO HAY PRODUCTOS REGISTRADOS</p>
            </div>
        </div>
    );
};
