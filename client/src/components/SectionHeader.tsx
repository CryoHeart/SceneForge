type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="space-y-2">
      {eyebrow && <p className="text-xs uppercase tracking-[0.2em] text-rose-200/80">{eyebrow}</p>}
      <h2 className="font-display text-4xl leading-tight text-white sm:text-5xl">{title}</h2>
      {subtitle && <p className="max-w-3xl text-sm text-white/65 sm:text-base">{subtitle}</p>}
    </div>
  );
}
