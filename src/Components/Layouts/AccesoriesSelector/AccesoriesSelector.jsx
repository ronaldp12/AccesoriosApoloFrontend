import { useState } from 'react';
import { FilterOption } from "../../Ui/FilterOption/FilterOption.jsx";
import '../AccesoriesSelector/AccesoriesSelector.css';

export const AccessoriesSelector = () => {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');

    return (
        <section className="hero-accessories">
            <div className="hero-content">
                <div className="container-accessories">
                    <div className="empty-container"></div>

                    <div className="filters-container">
                        <h2>ELIGE TU ACCESORIO SEGÚN TU MODELO</h2>

                        <FilterOption
                            number="1"
                            label="SELECCIONA LA MARCA"
                            options={["Yamaha", "Suzuki", "Kawasaki"]}
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        />
                        <FilterOption
                            number="2"
                            label="SELECCIONA EL MODELO"
                            options={["R6", "GSX-R", "Ninja 400"]}
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                        />
                        <FilterOption
                            number="3"
                            label="SELECCIONA EL AÑO"
                            options={["2020", "2021", "2022"]}
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />

                        <button className="search-button">
                            <span>BUSCAR</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
