interface Props {
  value: string | number;
  label: string;
  accent?: boolean;
}

export function StatCard({ value, label, accent }: Props) {
  return (
    <div className="card p-4 text-center">
      <div className={`text-xl font-bold ${accent ? "text-gold" : "text-wood"}`}>{value}</div>
      <div className="text-[10px] text-wood-light mt-1">{label}</div>
    </div>
  );
}
