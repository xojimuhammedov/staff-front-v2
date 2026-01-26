import React, { useEffect, useState } from 'react';
import { useController, Control } from 'react-hook-form';
import dayjs from 'dayjs';

interface Props {
  control: Control<any>;
  name: string;
  label?: string;
}

export const MyDateTimePicker: React.FC<Props> = ({ control, name, label }) => {
  const { field } = useController({ name, control });
  const [datePart, setDatePart] = useState(
    field.value ? dayjs(field.value).format('YYYY-MM-DD') : ''
  );
  const [timePart, setTimePart] = useState(
    field.value ? dayjs(field.value).format('HH:mm') : '09:00'
  );

  useEffect(() => {
    if (datePart) {
      const combined = dayjs(`${datePart} ${timePart}`).toISOString();
      field.onChange(combined);
    }
  }, [datePart, timePart]);

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-text-title-dark">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2 rounded-md border border-border-base bg-bg-field p-1 shadow-base focus-within:ring-2 focus-within:ring-bg-brand dark:bg-bg-form">
        <input
          type="date"
          value={datePart}
          onChange={(e) => setDatePart(e.target.value)}
          className="border-none bg-transparent p-1 text-sm text-text-base outline-none focus:ring-0 dark:text-text-title-dark"
        />
        <div className="h-6 w-[1px] bg-gray-300 dark:bg-dark-line" />
        <input
          type="time"
          value={timePart}
          onChange={(e) => setTimePart(e.target.value)}
          className="cursor-pointer border-none bg-transparent p-1 text-sm text-text-base outline-none focus:ring-0 dark:text-text-title-dark"
        />
      </div>
    </div>
  );
};
