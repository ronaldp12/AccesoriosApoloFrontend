import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { motion } from 'framer-motion';

const data = [
    { nombre: 'Casco Azul', cantidad: 15 },
    { nombre: 'Casco Verde', cantidad: 20 },
    { nombre: 'Casco Rojo', cantidad: 10 },
];

export const TopProductsChart = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <BarChart width={500} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip
                    cursor={{ fill: 'transparent' }}
                />

                <Legend />
                <Bar
                    dataKey="cantidad"
                    isAnimationActive={true}
                    animationDuration={800}
                    animationEasing="ease-out"
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={stringToColor(entry.nombre)}
                            fillOpacity={activeIndex === null ? 1 : activeIndex === index ? 1 : 0.3}
                            style={{
                                transition: 'all 0.3s ease',
                                transform:
                                    activeIndex === index ? 'scale(1.05)' : 'scale(1)',
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
