"use client";

interface Option {
  label: string;
  value: string;
  emoji?: string;
}

interface QuestionCardProps {
  question: string;
  options: Option[];
  onSelect: (value: string, label: string) => void;
  disabled?: boolean;
}

export function QuestionCard({ question, options, onSelect, disabled }: QuestionCardProps) {
  return (
    <div className="space-y-2 max-w-sm">
      <p className="text-sm font-medium text-foreground">{question}</p>
      <div className="flex flex-col gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            disabled={disabled}
            onClick={() => onSelect(opt.value, opt.label)}
            className="flex items-center gap-2 text-left px-4 py-2.5 rounded-xl border bg-white hover:bg-primary/5 hover:border-primary/40 active:bg-primary/10 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {opt.emoji && <span className="text-base">{opt.emoji}</span>}
            <span>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
