import { useNavigate } from 'react-router-dom';
import '../BrandSubmenu/BrandSubmenu.css';
import img1 from '../../../assets/images/img1-marca.png';
import img2 from '../../../assets/images/img2-marca.png';
import img3 from '../../../assets/images/img3-marca.png';
import img4 from '../../../assets/images/img4-marca.png';
import img5 from '../../../assets/images/img5-marca.png';

export const BrandSubmenu = ({ onCloseSubmenu }) => {
    const navigate = useNavigate();

    const brands = [
        { name: 'Ich', image: img1 },
        { name: 'Shaft', image: img2 },
        { name: 'Hro', image: img3 },
        { name: 'Arai', image: img4 },
        { name: 'Shoei', image: img5 }
    ];

    const handleBrandClick = (brandName) => {
        navigate(`/products?brand=${encodeURIComponent(brandName)}`);

        if (onCloseSubmenu) {
            onCloseSubmenu();
        }
    };

    const handleOtrosClick = () => {
        // Navegar a productos de "Otros" (marcas no incluidas en las principales)
        navigate(`/products?brand=Otros`);

        if (onCloseSubmenu) {
            onCloseSubmenu();
        }
    };

    const handleVerMasClick = () => {
        navigate('/products');

        if (onCloseSubmenu) {
            onCloseSubmenu();
        }
    };

    return (
        <div className="brand-submenu">
            <div className='submenu-title-brand'>
                <h2>Marcas</h2>
                <span
                    onClick={handleVerMasClick}
                    style={{ cursor: 'pointer' }}
                >
                    Ver más
                </span>
            </div>

            <div className="container-brand2">
                {brands.map((brand, index) => (
                    <div
                        key={index}
                        className="submenu-item"
                        onClick={() => handleBrandClick(brand.name)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={brand.image} alt={brand.name} />
                        <p>{brand.name}</p>
                    </div>
                ))}

                {/* Opción adicional para "Otros" */}
                <div
                    className="submenu-item"
                    onClick={handleOtrosClick}
                    style={{ cursor: 'pointer' }}
                >
                    <div
                        style={{
                            width: '60px',
                            height: '40px',
                            backgroundColor: '#f0f0f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: '#666'
                        }}
                    >
                        Otros
                    </div>
                    <p>Otros</p>
                </div>
            </div>
        </div>
    );
};