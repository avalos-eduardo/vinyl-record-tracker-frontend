import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  type TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

interface DecadeChartProps {
  data: Record<string, number>;
}

export default function DecadeChart({ data }: DecadeChartProps) {
  // Sort decades chronologically
  const keys = Object.keys(data).sort();

  const chartData = {
    labels: keys,
    datasets: [
      {
        label: "Records",
        data: keys.map((k) => data[k]),
        backgroundColor: "#6b85b5",
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"bar">) => ` ${ctx.parsed.y} records`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: { family: "monospace", size: 11 },
          color: "#3C3B3B",
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          font: { family: "monospace", size: 11 },
          color: "#3C3B3B",
          stepSize: 1,
        },
        grid: { color: "#f0f0f0" },
        beginAtZero: true,
      },
    },
  };

  if (keys.length === 0) {
    return (
      <p className="font-mono text-sm text-gray-400 text-center py-8">
        No data yet.
      </p>
    );
  }

  return <Bar data={chartData} options={options} />;
}
