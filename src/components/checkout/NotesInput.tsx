"use client";
import { Textarea } from "@/components/ui/Input";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function NotesInput({ value, onChange }: Props) {
  return (
    <div className="card p-4">
      <h3 className="text-xs text-wood font-semibold tracking-wider mb-2">✍️ 备注与定制要求</h3>
      <Textarea
        placeholder="定制祝福语、口味偏好、配送时间都可以写在这里..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
      />
      <p className="text-[10px] text-gold mt-2">
        💡 定制祝福语、口味偏好、配送时间都可以写在这里
      </p>
    </div>
  );
}
