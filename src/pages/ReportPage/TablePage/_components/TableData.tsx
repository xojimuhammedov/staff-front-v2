import Loading from 'assets/icons/Loading';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import dayjs from 'dayjs';
import { useGetAllQuery } from 'hooks/api';
import { useDownloadExcel } from 'hooks/useExcel';
import i18n from 'i18n';
import { ArrowLeftToLine, Backpack, Download } from 'lucide-react';
import { useMemo, useRef, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import storage from 'services/storage';
import { addHours, timeLine } from 'utils/helper';

const TableData = () => {
  const { t, i18n } = useTranslation();
  const currentTableRef = useRef<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const employeeIds = searchParams.getAll('employeeIds').map(Number);
  const darkLight = storage.get('theme');
  const currentLang = i18n.resolvedLanguage;

  const filename = `timesheet_${dayjs(new Date()).format('YYYY-MM-DD_hh:mm:ss')}`;
  const sheet = 'users';
  const downloadExcel = useDownloadExcel({ currentTableRef, filename, sheet });

  const employeeIdsQuery = useMemo(() => {
    return employeeIds.map((id) => `employeeIds=${id}`).join('&');
  }, [employeeIds]);
  const { data, isLoading } = useGetAllQuery<any>({
    key: KEYS.employeeTimesheet,
    url: `${URLS.employeeTimesheet}?${employeeIdsQuery}`,
    params: {
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
    },
  });

  const getStatusStyle = (status: string) => {
    if (status === 'ABSENT') {
      return {
        light: {
          bg: '#fee2e2',
          text: '#991b1b',
          border: '#fca5a5',
        },
        dark: {
          bg: '#7f1d1d',
          text: '#fecaca',
          border: '#991b1b',
        },
      };
    } else if (status === 'LATE') {
      return {
        light: {
          bg: '#fef3c7',
          text: '#92400e',
          border: '#fcd34d',
        },
        dark: {
          bg: '#78350f',
          text: '#fde68a',
          border: '#92400e',
        },
      };
    }
    return {
      light: {
        bg: 'transparent',
        text: darkLight === 'dark' ? '#f3f4f6' : '#111827',
        border: '#e5e7eb',
      },
      dark: { bg: 'transparent', text: '#f3f4f6', border: '#374151' },
    };
  };

  const thBase: any = {
    border: `1px solid ${darkLight === 'dark' ? '#4b5563' : '#ccc'}`,
    padding: '8px',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '400',
    color: darkLight === 'dark' ? '#f3f4f6' : '#111827',
  };

  const tdBase: any = {
    border: `1px solid ${darkLight === 'dark' ? '#4b5563' : '#ccc'}`,
    padding: '8px',
    textAlign: 'center',
    fontSize: '12px',
  };

  const thGroup = {
    ...thBase,
    textAlign: 'center',
    fontWeight: 600,
  };

  const thVerticalWrap = {
    ...thBase,
    padding: 0,
    width: 52,
    minWidth: 52,
    maxWidth: 52,
    height: 220, // rasmga o‘xshashi uchun
    verticalAlign: 'middle',
  };

  const verticalText: CSSProperties = {
    writingMode: 'vertical-rl',
    transform: 'rotate(180deg)',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '120px',
    padding: '6px 4px',
    lineHeight: 1.1,
  };

  const thCode = {
    ...thBase,
    width: 52,
    minWidth: 52,
    maxWidth: 52,
    textAlign: 'center',
    fontWeight: 600,
  };

  const formatWeekday = (weekday?: string) => {
    if (!weekday) return '';
    const translated = t(weekday);
    return translated || weekday;
  };

  const handleBack = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('current-step', '1');
        return next;
      },
      { replace: true }
    );
  };

  const types = data?.absenceTypes || [];
  const absenceColsCount = 1 + types.length;

  const getShort = (x: any) =>
    i18n.language === 'ru'
      ? x.shortLetterRu
      : i18n.language === 'en'
        ? x.shortLetterEng
        : x.shortLetterUz;

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full h-full overflow-hidden border p-4 rounded-m">
      <div className="flex items-center mb-4 gap-4 justify-end">
        <MyButton variant="secondary" onClick={handleBack} startIcon={<ArrowLeftToLine />}>
          {t('Previous')}
        </MyButton>
        <MyButton onClick={downloadExcel.onDownload} startIcon={<Download />} variant="secondary">
          {t('Download')}
        </MyButton>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="w-full h-full min-w-0 overflow-auto">
          <table
            className="border-collapse"
            ref={currentTableRef}
            style={{
              borderCollapse: 'collapse',
              border: `1px solid ${darkLight === 'dark' ? '#4b5563' : '#ccc'}`,
              minWidth: 'max-content',
              backgroundColor: darkLight === 'dark' ? '#1f2937' : 'white',
            }}
          >
            <thead style={{ background: darkLight === 'dark' ? '#374151' : '#e5e7eb' }}>
              <tr>
                <th style={thBase} rowSpan={3}>
                  №
                </th>
                <th style={{ ...thBase, minWidth: '150px', maxWidth: '250px' }} rowSpan={3}>
                  {t('FIO')}
                </th>
                <th style={{ ...thBase, minWidth: '80px', maxWidth: '150px' }} rowSpan={3}>
                  {t('Job title')}
                </th>
                <th style={thBase} rowSpan={3}>
                  {t('Subdivision')}
                </th>
                <th style={thBase} rowSpan={3}>
                  {t('According to plan')}
                </th>
                {data?.dateData?.map((item: any) => (
                  <th key={`${item?.date}-${item?.weekday}`} style={thBase} rowSpan={3}>
                    {formatWeekday(item?.weekday)} ({item?.date})
                  </th>
                ))}
                <th style={thBase} rowSpan={3}>
                  {t('По плану')}
                </th>
                <th style={thBase} rowSpan={3}>
                  {t('Опоздание')}
                </th>
                <th style={thBase} rowSpan={3}>
                  {t('Ранний уход')}
                </th>
                <th style={thBase} rowSpan={3}>
                  {t('Отработано')}
                </th>
                <th style={thBase} rowSpan={3}>
                  {t('Вовремя')}
                </th>
                <th style={thBase} rowSpan={3}>
                  {t('Сверхурочно')}
                </th>
                <th style={thBase} rowSpan={3}>
                  {t('Вне графика')}
                </th>
                <th style={thBase} colSpan={2}>
                  {t('Off schedule')}
                </th>
                <th style={{ ...thBase, maxWidth: '80px' }} rowSpan={3}>
                  {t('Total')}
                </th>
                <th style={{ ...thBase, width: '70px' }} rowSpan={3}>
                  {t('Days worked')}
                </th>
                {/* Absence title (Days worked dan keyin) */}
                <th style={thGroup} colSpan={absenceColsCount}>
                   {t("Ishda qatnashmaslik sabablari (kishi/kun)")}
                </th>
              </tr>
              <tr>
                {/* Off schedule sub columns */}
                <th rowSpan={3} style={{ ...thBase, maxWidth: '80px' }}>
                  {t('Because of')}
                </th>
                <th rowSpan={3} style={{ ...thBase, maxWidth: '80px' }}>
                  {t('Without a reason')}
                </th>

                {/* Absence vertical headers (ulardan YO‘Q) */}
                <th style={thVerticalWrap}>
                  <div style={verticalText}>{t("Umumiy")}</div>
                </th>

                {types.map((x: any) => (
                  <th key={`desc-${x.id}`} style={thVerticalWrap}>
                    <div style={verticalText}>
                      {currentLang === 'uz'
                        ? x.descriptionUz
                        : currentLang === 'ru'
                          ? x.descriptionRu
                          : x.descriptionEng}
                    </div>
                  </th>
                ))}
              </tr>
              <tr>
                <th style={thCode}></th>
                {types.map((x: any) => (
                  <th key={`code-${x.id}`} style={thCode}>
                    {/* {x.shortLetterUz} */}
                    {currentLang === 'uz'
                        ? x.shortLetterUz
                        : currentLang === 'ru'
                          ? x.shortLetterRu
                          : x.shortLetterEng}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.reportData?.map((evt: any, index: number) => {
                const countsArr = evt?.absenceCounts || [];

                const byShort = new Map(
                  countsArr.map((c: any) => [
                    i18n.language === 'ru'
                      ? c.shortLetterRu
                      : i18n.language === 'en'
                        ? c.shortLetterEng
                        : c.shortLetterUz,
                    Number(c.count ?? 0),
                  ])
                );

                // Umumiy (sum)
                const totalAbsence = countsArr.reduce(
                  (sum: any, c: any) => sum + Number(c.count ?? 0),
                  0
                );
                return (
                  <tr key={index}>
                    <td style={tdBase}>{index + 1}</td>
                    <td style={{ ...tdBase, color: darkLight === 'dark' ? '#f3f4f6' : '#111827' }}>
                      {evt?.fio}
                    </td>
                    <td style={{ ...tdBase, color: darkLight === 'dark' ? '#f3f4f6' : '#111827' }}>
                      {evt?.position ?? '--'}
                    </td>
                    <td style={{ ...tdBase, color: darkLight === 'dark' ? '#f3f4f6' : '#111827' }}>
                      {evt.department ?? '--'}
                    </td>
                    <td style={{ ...tdBase, color: darkLight === 'dark' ? '#f3f4f6' : '#111827' }}>
                      {evt?.workSchedule}
                    </td>
                    {evt?.daysStatistics?.map((item: any, i: number) => {
                      const statusColors = getStatusStyle(item?.status);
                      const colors = darkLight === 'dark' ? statusColors.dark : statusColors.light;

                      console.log(item)

                      return (
                        <td
                          key={i}
                          className={`${item.status === "ABSENT" && item.totalMinutes === 0 ? 'bg-red-200' : ''}`}
                          style={{
                            ...tdBase,
                            fontWeight: item?.status !== 'PRESENT' ? '400' : '400',
                          }}
                        >
                          {item?.startTime && item?.endTime
                            ? `(${addHours(item.startTime)}-${addHours(item.endTime)}) `
                            : item?.startTime
                              ? `(${addHours(item.startTime)}) `
                              : ''}
                          {item.status === "ON_VACATION" ? item.shortLetter : <>{item.totalMinutes ? timeLine(item?.totalMinutes) : "X"}</>}
                        </td>
                      );
                    })}
                    <td style={{ ...tdBase, color: darkLight === 'dark' ? '#f3f4f6' : '#111827' }}>
                      {timeLine(evt?.totalPlannedMinutes) ?? '--'}
                    </td>
                    <td style={{ ...tdBase, color: darkLight === 'dark' ? '#f3f4f6' : '#111827' }}>
                      {timeLine(evt?.totalLateMinutes) ?? '--'}
                    </td>
                    <td style={{ ...tdBase, color: darkLight === 'dark' ? '#f3f4f6' : '#111827' }}>
                      {timeLine(evt?.totalEarlyMinutes) ?? '--'}
                    </td>
                    <td style={{ ...tdBase, color: darkLight === 'dark' ? '#f3f4f6' : '#111827' }}>
                      {timeLine(evt?.totalWorkedMinutes) ?? '--'}
                    </td>
                    <td style={{ ...tdBase, color: darkLight === 'dark' ? '#f3f4f6' : '#111827' }}>
                      {timeLine(evt?.onTimeMinutes) ?? '--'}
                    </td>
                    <td style={{ ...tdBase, color: darkLight === 'dark' ? '#f3f4f6' : '#111827' }}>
                      {timeLine(evt?.overtimeMinutes) ?? '--'}
                    </td>
                    <td style={{ ...tdBase, color: darkLight === 'dark' ? '#f3f4f6' : '#111827' }}>
                      {timeLine(evt?.overtimePlanMinutes) ?? '--'}
                    </td>
                    <td style={{ ...tdBase, color: darkLight === 'dark' ? '#f3f4f6' : '#111827' }}>
                      {timeLine(evt?.reasonableAbsentMinutes) ?? '--'}
                    </td>
                    <td style={{ ...tdBase, color: darkLight === 'dark' ? '#f3f4f6' : '#111827' }}>
                      {timeLine(evt?.unreasonableAbsentMinutes) ?? '--'}
                    </td>
                    <td style={{ ...tdBase, color: darkLight === 'dark' ? '#f3f4f6' : '#111827' }}>
                      {timeLine(evt?.totalMinutes) ?? '--'}
                    </td>
                    <td style={{ ...tdBase, color: darkLight === 'dark' ? '#f3f4f6' : '#111827' }}>
                      {evt?.totalDays ?? '--'}
                    </td>
                    <td
                      style={{
                        ...tdBase,
                        color: darkLight === 'dark' ? '#f3f4f6' : '#111827',
                        textAlign: 'center',
                      }}
                    >
                      {totalAbsence}
                    </td>

                    {/* Types bo‘yicha tartibli */}
                    {types.map((t: any) => {
                      const key = getShort(t); // header’dagi shortLetter
                      const val: any = byShort.get(key) ?? 0;

                      return (
                        <td
                          key={`abs-${evt?.id ?? index}-${t.id}`}
                          style={{
                            ...tdBase,
                            color: darkLight === 'dark' ? '#f3f4f6' : '#111827',
                            textAlign: 'center',
                          }}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableData;
