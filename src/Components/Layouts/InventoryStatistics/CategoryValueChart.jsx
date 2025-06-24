import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import './CategoryValueChart.css';

export const CategoryValueChart = () => {
    const [data, setData] = useState([]);
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await fetch('https://accesoriosapolobackend.onrender.com/categorias-con-valor');
                const result = await response.json();
                console.log(result);

                if (result.success) {
                    const categoriasFormateadas = (result.data || []).map(cat => ({
                        categoria: cat.nombre,
                        valor: parseFloat(cat.valor),
                    }));

                    setData(categoriasFormateadas);
                    const coloresGenerados = categoriasFormateadas.map(() => getRandomColor());
                    setColors(coloresGenerados);
                } else {
                    console.error('Error en API:', result.message);
                }
            } catch (error) {
                console.error('Error al conectar con API:', error);
            } finally {
                setLoading(false);
                setAnimate(true);
            }
        };

        fetchCategorias();
    }, []);

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    if (loading) {
        return <p>Cargando gráfica de categorías...</p>;
    }

    if (!data.length) {
        return <p>No hay datos para mostrar.</p>;
    }

    return (
        <div className={`pie-chart-container ${animate ? 'bounce' : ''}`}>
            <h2 className="text-xl font-semibold mb-4">Valor Total por Categoría</h2>
            <PieChart width={500} height={300}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="valor"
                    nameKey="categoria"
                    animationDuration={1000}
                    isAnimationActive={true}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};
