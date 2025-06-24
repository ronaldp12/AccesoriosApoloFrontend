import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { motion } from 'framer-motion';

export const TopMasStockChart = () => {
    const [data, setData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMasStock = async () => {
            try {
                const response = await fetch('https://accesoriosapolobackend.onrender.com/productos/mas-stock');
                const result = await response.json();

                if (result.success) {
                    const dataFormateada = (result.data || []).map(item => ({
                        nombre: item.nombre || 'Sin nombre',
                        cantidad: item.stock || 0,
                    }));
                    setData(dataFormateada);
                } else {
                    console.error('Error en API:', result.message);
                }
            } catch (error) {
                console.error('Error al conectar con API:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMasStock();
    }, []);

    if (loading) {
        return <p>Cargando gráfico de más stock...</p>;
    }

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <h2 className="text-xl font-semibold mb-4">Top 5 Productos con Más Stock</h2>
            <BarChart width={500} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Legend />
                <Bar dataKey="cantidad" isAnimationActive={true} animationDuration={800} animationEasing="ease-out">
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={stringToColor(entry.nombre)}
                            fillOpacity={activeIndex === null ? 1 : activeIndex === index ? 1 : 0.3}
                            style={{
                                transition: 'all 0.3s ease',
                                transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)',
                                transformOrigin: 'center bottom',
                            }}
                            onMouseEnter={() => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(null)}
                        />
                    ))}
                </Bar>
            </BarChart>
        </motion.div>
    );
};

function stringToColor(str) {
    if (!str) return '#ccc';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}
