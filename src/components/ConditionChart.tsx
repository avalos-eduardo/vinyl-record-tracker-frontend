import { Chart, ArcElement, Tooltip, Legend, type TooltipItem } from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register(ArcElement, Tooltip, Legend);

const CONDITION_COLORS: Record<string, string> = {
  MINT: "#718b74",
  VERY_GOOD: "#6b85b5",
  GOOD: "#c4a55a",
  FAIR: "#9e9e9e",
  POOR: "#b56b6b",
};

const CONDITION_LABELS: Record<string, string> = {
  MINT: "Mint",
  VERY_GOOD: "Very Good",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
};

const CONDITION_ORDER = ["MINT", "VERY_GOOD", "GOOD", "FAIR", "POOR"] as const;

interface ConditionChartProps {
  data: Record<string, number>;
}

export default function ConditionChart({ data }: ConditionChartProps) {
  const keys = CONDITION_ORDER.filter(
    (condition) => data[condition] !== undefined,
  );

  const chartData = {
    labels: keys.map((k) => CONDITION_LABELS[k] ?? k),
    datasets: [
      {
        data: keys.map((k) => data[k]),
        backgroundColor: keys.map((k) => CONDITION_COLORS[k] ?? "#cccccc"),
        borderWidth: 1,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          font: { family: "monospace", size: 12 },
          color: "#3C3B3B",
          boxWidth: 12,
          padding: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"doughnut">) =>
            ` ${ctx.label}: ${ctx.parsed} records`,
        },
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

  return <Doughnut data={chartData} options={options} />;
}
