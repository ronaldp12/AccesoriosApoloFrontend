import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

export const InventoryEvolutionChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventarios = async () => {
            try {
                const response = await fetch('https://accesoriosapolobackend.onrender.com/inventarios-ultimos-7-dias');
                const result = await response.json();

                if (result.success) {
                    const dataFormateada = (result.data || []).map(item => ({
                        fecha: formatDate(item.fecha),
                        unidades: item.cantidad_unidades || 0,
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

        fetchInventarios();
    }, []);

    const formatDate = (fechaString) => {
        if (!fechaString) return 'Sin fecha';
        const date = new Date(fechaString);
        if (isNaN(date)) return 'Fecha inválida';
        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        return `${day}-${month}`;
    };

    if (loading) {
        return <p>Cargando gráfica de inventarios...</p>;
    }

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <h2 className="text-xl font-semibold mb-4">Evolución de Inventario (últimos 7 registros)</h2>
            <LineChart width={500} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="unidades"
                    stroke="#014aad"
                    strokeWidth={3}
                    animationDuration={800}
                />
            </LineChart>
        </motion.div>
    );
};
