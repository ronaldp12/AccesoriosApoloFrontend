import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
    { fecha: '07-06', unidades: 60 },
    { fecha: '08-06', unidades: 58 },
    { fecha: '09-06', unidades: 65 },
    { fecha: '10-06', unidades: 55 },
    { fecha: '11-06', unidades: 70 },
    { fecha: '12-06', unidades: 68 },
    { fecha: '13-06', unidades: 72 },
];

export const InventoryEvolutionChart = () => {
    return (
        <LineChart width={500} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="unidades" stroke="#014aad" strokeWidth={3} animationDuration={800} />
        </LineChart>
    );
};
