import React from 'react';
import { useTranslation } from 'react-i18next';

export const AttendanceLegend = () => {
  const { t } = useTranslation();
  const legendItems = [
    {
      status: 'PRESENT',
      bg: 'bg-white border border-gray-300',
      label: t("Vaqtida kelgan"),
    },
    {
      status: 'ABSENT',
      bg: 'bg-red-200',
      label: t("Kelmagan"),
      symbol: 'X',
    },
    {
      status: 'LATE',
      bg: 'bg-yellow-200',
      label: t("Kechikib kelgan"),
    },
    {
      status: 'ON_VACATION',
      bg: 'bg-green-200',
      label: t("Ta'tilda"),
    },
    {
      status: 'WEEKEND',
      bg: 'bg-white border border-gray-300',
      label: t("Dam olish kuni"),
      symbol: 'X',
    },
  ];
  return (
    <div className="flex flex-wrap items-center gap-4">
      {legendItems.map((item) => (
        <div key={item.status} className="flex items-center gap-1.5">
          <div
            className={`flex h-6 w-6 items-center justify-center rounded text-xs font-medium ${item.bg}`}
          >
            {item.symbol ?? ''}
          </div>
          <span className="text-sm text-gray-700">{item?.label}</span>
        </div>
      ))}
    </div>
  );
};
