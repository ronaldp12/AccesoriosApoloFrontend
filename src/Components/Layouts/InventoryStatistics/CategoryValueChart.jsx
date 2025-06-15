import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import './CategoryValueChart.css';

const data = [
    { categoria: 'Cascos', valor: 10850000 },
    { categoria: 'Guantes', valor: 3250000 },
    { categoria: 'Chaquetas', valor: 5800000 },
    { categoria: 'Botas', valor: 2100000 },
];

const COLORS = data.map(() => getRandomColor());

export const CategoryValueChart = () => {
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        // Activa la clase de animación al montar
        setAnimate(true);
    }, []);

    return (
        <div className={`pie-chart-container ${animate ? 'bounce' : ''}`}>
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
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
};

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
