'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type QuizResult = {
  score: number;
  total: number;
  date: string;
};

interface PerformanceChartProps {
  data: QuizResult[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = data.map((res, index) => ({
    name: res.date,
    Pontos: res.score,
    Total: res.total,
  }));

  return (
    <div className="w-full h-72 mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="Pontos" stroke="#8884d8" strokeWidth={2} />
          <Line type="monotone" dataKey="Total" stroke="#ccc" strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
