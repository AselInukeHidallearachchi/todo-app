import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  month?: Date;
  onMonthChange?: (date: Date) => void;
  disabled?: (date: Date) => boolean;
  selected?: Date;
  onSelect?: (date: Date) => void;
}

function Calendar({
  className,
  month,
  onMonthChange,
  disabled,
  selected,
  onSelect,
  ...props
}: CalendarProps) {
  const [displayMonth, setDisplayMonth] = React.useState<Date>(
    month || new Date()
  );

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(displayMonth);
  const firstDay = getFirstDayOfMonth(displayMonth);
  const days: (number | null)[] = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    const newDate = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth() - 1
    );
    setDisplayMonth(newDate);
    onMonthChange?.(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth() + 1
    );
    setDisplayMonth(newDate);
    onMonthChange?.(newDate);
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth(),
      day
    );

    if (disabled?.(newDate)) return;

    onSelect?.(newDate);
  };

  const monthName = displayMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const isSelected = (day: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === displayMonth.getMonth() &&
      selected.getFullYear() === displayMonth.getFullYear()
    );
  };

  const isDisabled = (day: number) => {
    const date = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth(),
      day
    );
    return disabled?.(date) || false;
  };

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={handlePrevMonth}
          className="h-7 w-7"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-semibold">{monthName}</div>
        <Button
          variant="outline"
          size="icon-sm"
          onClick={handleNextMonth}
          className="h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="text-center text-xs font-medium text-muted-foreground w-8 h-8 flex items-center justify-center"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="w-8 h-8" />;
          }

          const dayDisabled = isDisabled(day);
          const daySelected = isSelected(day);

          return (
            <button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={dayDisabled}
              className={cn(
                "w-8 h-8 text-sm font-medium rounded hover:bg-accent transition-colors flex items-center justify-center",
                daySelected &&
                  "bg-primary text-primary-foreground hover:bg-primary",
                dayDisabled &&
                  "text-muted-foreground cursor-not-allowed opacity-50"
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
