import React from 'react';
import { useTranslation } from 'react-i18next';
import './style.css';
import { addHours, timeLine } from 'utils/helper';

const thBase: React.CSSProperties = {
  height: '30px',
  fontSize: '12px',
  border: '1px solid gray',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  padding: '6px 10px',
};

const tdBase: React.CSSProperties = {
  height: '30px',
  fontSize: '12px',
  border: '1px solid gray',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  padding: '6px 10px',
};

const TimeSheet = ({ currentTableRef, data }: any) => {
  const { t } = useTranslation();

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden">
      <table
        ref={currentTableRef}
        className="border-collapse"
        style={{
          borderCollapse: 'collapse',
          border: '1px solid rgb(204, 204, 204)',
          // eng muhim joy: table siqilmaydi, kontent bo‘yicha kengayadi
          minWidth: 'max-content',
        }}
      >
        <thead style={{ background: '#c2c2c2' }}>
          <tr style={{ background: '#c2c2c2' }}>
            <th
              style={thBase}
              rowSpan={2}
            >
              №
            </th>
            <th
              style={{
                ...thBase,
                minWidth: '150px',
                maxWidth: '250px',
              }}
              rowSpan={2}
            >
              {t('FIO')}
            </th>
            <th
              style={{
                ...thBase,
                minWidth: '80px',
                maxWidth: '150px',
              }}
              rowSpan={2}
            >
              {t('Job title')}
            </th>
            <th
              style={thBase}
              rowSpan={2}
            >
              {t('Subdivision')}
            </th>
            <th
              style={thBase}
              rowSpan={2}
            >
              {t('According to plan')}
            </th>
            {data?.dateData?.map((item: any) => (
              <th
                key={`${item?.date}-${item?.weekday}`} style={thBase}
                rowSpan={2}
              >
                {item?.weekday} {''} ({item?.date})
              </th>
            ))}
            <th
              style={thBase}
              rowSpan={2}
            >
              {t('По плану')}
            </th>
            <th
              style={thBase}
              rowSpan={2}
            >
              {t('Опоздание')}
            </th>
            <th
              style={thBase}
              rowSpan={2}
            >
              {t('Ранний уход')}
            </th>
            <th
              style={thBase}
              rowSpan={2}
            >
              {t('Отработано')}
            </th>
            <th
              style={thBase}
              rowSpan={2}
            >
              {t('Вовремя')}
            </th>
            <th
              style={thBase}
              rowSpan={2}
            >
              {t('Сверхурочно')}
            </th>
            <th
              style={thBase}
              rowSpan={2}
            >
              {t('Вне графика')}
            </th>
            <th
              style={thBase}
              colSpan={2}
            >
              {t('Off schedule')}
            </th>
            <th
              style={{ ...thBase, maxWidth: '80px' }}
              rowSpan={2}
            >
              {t('Total')}
            </th>
            <th
              style={{ ...thBase, width: '70px' }}
              rowSpan={2}
            // className="working-days"
            >
              {t('Days worked')}
            </th>
          </tr>
          <tr style={{ background: '#c2c2c2' }}>
            <th
              style={{ ...thBase, maxWidth: '80px' }}
            >
              {t('Because of')}
            </th>
            <th
              style={{ ...thBase, maxWidth: '80px' }}
            >
              {t('Without a reason')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.reportData?.map((evt: any, index: number) => {
            return (
              <tr key={index} className="dark:text-text-title-dark">
                <td
                  style={tdBase}
                >
                  {index + 1}
                </td>
                <td
                  style={tdBase}
                >
                  {evt?.fio}
                </td>
                <td
                  style={tdBase}
                >
                  {evt?.position ?? '--'}
                </td>
                <td
                  style={tdBase}
                >
                  {evt.department ?? '--'}
                </td>
                <td style={tdBase}
                >
                  {evt?.workSchedule}
                </td>
                {evt?.daysStatistics?.map((item: any, i: number) => (
                  <td
                    key={i}
                    style={{
                      ...tdBase,
                      backgroundColor:
                        item?.status === 'ABSENT'
                          ? 'pink'
                          : item?.status === 'LATE'
                            ? 'yellow'
                            : 'transparent',
                    }}
                  >
                    {item?.startTime && item?.endTime
                      ? `(${addHours(item.startTime)}-${addHours(item.endTime)})`
                      : item?.startTime
                        ? `(${addHours(item.startTime)})`
                        : ''}{' '}
                    {timeLine(item?.totalMinutes)}
                  </td>
                ))}
                <td
                  style={tdBase}
                >
                  {timeLine(evt?.totalPlannedMinutes) ?? '--'}
                </td>
                <td
                  style={tdBase}
                >
                  {timeLine(evt?.totalLateMinutes) ?? '--'}
                </td>
                <td
                  style={tdBase}
                >
                  {timeLine(evt?.totalEarlyMinutes) ?? '--'}
                </td>
                <td
                  style={tdBase}
                >
                  {timeLine(evt?.totalWorkedMinutes) ?? '--'}
                </td>
                <td
                  style={tdBase}
                >
                  {timeLine(evt?.onTimeMinutes) ?? '--'}
                </td>
                <td
                  style={tdBase}
                >
                  {timeLine(evt?.overtimeMinutes) ?? '--'}
                </td>
                <td
                  style={tdBase}
                >
                  {timeLine(evt?.overtimePlanMinutes) ?? '--'}
                </td>
                <td
                  style={tdBase}
                >
                  {timeLine(evt?.reasonableAbsentMinutes) ?? '--'}
                </td>
                <td
                  style={tdBase}
                >
                  {timeLine(evt?.unreasonableAbsentMinutes) ?? '--'}
                </td>
                <td
                  style={tdBase}
                >
                  {timeLine(evt?.totalMinutes) ?? '--'}
                </td>
                <td
                  style={tdBase}
                >
                  {evt?.totalDays ?? '--'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(TimeSheet);
