'use client';

import { DayPicker } from 'react-day-picker';
import { uk } from 'date-fns/locale';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  defaultMonth,
  startMonth,
  endMonth,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={uk}
      classNames={{
        today: 'border-gray-500',
        selected: 'bg-gray-500 border-none rounded text-white',
        root: 'shadow-lg p-5',
        chevron: 'fill-gray-500',
        day: 'p-2 text-center',
        caption_label: 'hidden',
        dropdowns: 'flex gap-5 pb-5',
        nav: 'absolute top-5 right-3',
        disabled: 'opacity-2',
      }}
      captionLayout="dropdown"
      defaultMonth={defaultMonth || new Date()}
      startMonth={startMonth || new Date()}
      endMonth={endMonth || new Date()}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
