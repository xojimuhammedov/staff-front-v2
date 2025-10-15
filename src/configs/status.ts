import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

const statusData = [
  {
    id: 1,
    name: t('come'),
    value: true,
    visible: true,
    title: 'isAbsent'
  },
  {
    id: 2,
    name: t('ComeLate'),
    value: true,
    visible: true,
    title: 'isLateIn'
  },
  {
    id: 3,
    name: t('Came on time'),
    value: false,
    visible: true,
    title: 'isLateIn'
  }
];

export default statusData;
