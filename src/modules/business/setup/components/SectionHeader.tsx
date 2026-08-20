import { cn } from "@/components/ui/utils";
export type SectionTint = "blue";

interface Props {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  tint?: SectionTint;
}

const tintClasses: Record<SectionTint, string> = {
  blue: "border-primary/20 bg-primary/5 text-primary",
};

export default function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  tint = "blue",
}: Props) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={cn(
          "flex h-9 w-9 xl:h-15 xl:w-15 shrink-0 items-center justify-center rounded-lg border",
          tintClasses[tint]
        )}
      >
        <Icon className="h-[18px] w-[18px] xl:h-[30px] xl:w-[30px]" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <h3 className="text-lg xl:text-2xl font-bold text-slate-900">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-1 text-md leading-5 text-slate-500">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
