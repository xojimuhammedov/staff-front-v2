import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import 'dayjs/locale/uz';
import 'dayjs/locale/uz-latn';
import 'dayjs/locale/en';
import { useTranslation } from 'react-i18next';

type DateTextProps = {
  value?: string | Date | null;
  format?: string;
  fallback?: string;
  className?: string;
};

const DateText = ({
  value,
  format = 'DD MMM YYYY',
  fallback = '--',
  className,
}: DateTextProps) => {
  const { i18n } = useTranslation();
  const currentLang: any = i18n.resolvedLanguage;
  const locale = currentLang?.startsWith('ru')
    ? 'ru'
    : currentLang?.startsWith('uz')
      ? 'uz-latn'
      : 'en';

  if (!value) return <span className={className}>{fallback}</span>;

  return <span className={className}>{dayjs(value).locale(locale).format(format)}</span>;
};

export default DateText;
