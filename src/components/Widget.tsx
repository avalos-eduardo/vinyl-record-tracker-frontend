interface WidgetProps {
  label: string;
  value?: string | number;
  accentColor?: string;
  width?: string;
  height?: string;
}

export default function Widget({
  label,
  value,
  accentColor = "#718b74",
  width = "w-full",
  height = "h-24",
}: WidgetProps) {
  return (
    <div
      className={`${width} ${height} bg-white rounded-xl shadow-sm flex flex-col justify-center px-5 gap-1`}
      style={{ borderLeft: `6px solid ${accentColor}` }}
    >
      <p className="font-mono text-xs text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="font-mono font-bold text-2xl text-[#3C3B3B] truncate">
        {value ?? "—"}
      </p>
    </div>
  );
}
