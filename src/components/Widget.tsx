interface WidgetProps {
  label: string;
  accentColor?: string;
  width?: string;
  height?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function Widget({
  label,
  accentColor = "#718b74",
  width = "w-full",
  height = "h-40",
  className = "",
  children,
}: WidgetProps) {
  return (
    <div
      className={`${width} ${height} ${className} bg-[#d9d9d9] rounded-xl flex justify-center px-5 py-3`}
      style={{ borderLeft: `10px solid ${accentColor}` }}
    >
      <p className="font-semibold text-center text-[#3C3B3B] font-stretch-condensed">
        {label}
      </p>
      {children}
    </div>
  );
}
