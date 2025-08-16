import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type ForecastData = {
    date: string;
    predicted_demand: number;
}[];

interface ForecastChartProps {
    data: ForecastData;
}

export const ForecastChart = ({ data }: ForecastChartProps) => {
    if (!data || data.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Demand Forecast</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="predicted_demand" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};
