import { twMerge } from "tailwind-merge"


const ALL_WEEKDAYS = [
  { short: "MON", full: "Monday" },
  { short: "TUE", full: "Tuesday" },
  { short: "WED", full: "Wednesday" },
  { short: "THU", full: "Thursday" },
  { short: "FRI", full: "Friday" },
  { short: "SAT", full: "Saturday" },
  { short: "SUN", full: "Sunday" },
]

export function WeekdayBadges({ weekdays }: { weekdays: string }) {
  const activeWeekdays = weekdays?.split(",").map((d) => d.trim())

  return (
    <div className="flex items-center gap-1">
      {ALL_WEEKDAYS?.map((day) => {
        const isActive = activeWeekdays?.includes(day.full)
        return (
          <span
            key={day.short}
            className={twMerge(
              "inline-flex items-center justify-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
              isActive
                ? "bg-amber-100 text-amber-700"
                : "text-muted-foreground/50 dark:text-text-title-dark"
            )}
          >
            {day.short}
          </span>
        )
      })}
    </div>
  )
}
