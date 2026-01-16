import { useTranslation } from 'react-i18next';
import { Edit, Eye, Mail, MapPin, NotebookPen, Phone, Trash2 } from 'lucide-react';
import MyBadge from 'components/Atoms/MyBadge';
import MyButton from 'components/Atoms/MyButton/MyButton';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrganizationCard = ({ item, setOpen, setOrganizationId, setShow }: any) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="dark:bg-bg-dark-bg border border-gray-200 dark:border-[#2E3035] rounded-lg shadow-sm p-4 gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-inter font-medium dark:text-text-title-dark">
          {item?.fullName}
        </h3>
        <MyBadge variant="green">{item?.isActive ? 'Active' : 'isActive'}</MyBadge>
      </div>
      <div className="grid grid-cols-2 gap-2 my-4">
        <div className="rounded-lg bg-[#F9FAFB] dark:bg-bg-dark-theme p-3">
          <h5 className="text-sm dark:text-text-title-dark">{t('Departments')}</h5>
          <h3 className="text-2xl font-inter font-bold dark:text-text-title-dark">
            {item?._count?.departments}
          </h3>
        </div>
        <div className="rounded-lg bg-[#F9FAFB] dark:bg-bg-dark-theme p-3">
          <h5 className="text-sm dark:text-text-title-dark">{t('Employees')}</h5>
          <h3 className="text-2xl font-inter font-bold dark:text-text-title-dark">
            {item?._count?.employees}
          </h3>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <MapPin width={'16px'} />
        <p className="dark:text-text-title-dark">{item?.address}</p>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Phone width={'16px'} />
        <p className="dark:text-text-title-dark">{item?.phone}</p>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Mail width={'16px'} />
        <p className="dark:text-text-title-dark">{item?.email}</p>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <NotebookPen width={'16px'} />
        <p className="dark:text-text-title-dark">{item?.additionalDetails}</p>
      </div>
      <div className="flex items-center justify-between gap-4 mt-4">
        <MyButton
          variant="secondary"
          allowedRoles={['ADMIN']}
          className={`
      w-2/5
      bg-white text-gray-800 border border-gray-300 hover:bg-gray-100
      dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700
      [&_svg]:stroke-gray-600 dark:[&_svg]:stroke-gray-300
    `}
          onClick={() => navigate(`/view?organizationId=${item?.id}&current-setting=department`)}
          startIcon={<Eye />}
        >
          {t('View')}
        </MyButton>

        <MyButton
          variant="secondary"
          allowedRoles={['ADMIN']}
          className={`
      w-2/5
      bg-white text-gray-800 border border-gray-300 hover:bg-gray-100
      dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700
      [&_svg]:stroke-gray-600 dark:[&_svg]:stroke-gray-300
    `}
          onClick={() => {
            setShow(true);
            setOrganizationId(item?.id);
          }}
          startIcon={<Edit />}
        >
          {t('Edit')}
        </MyButton>
        <MyButton
          allowedRoles={['ADMIN']}
          variant="secondary"
          className={`
      w-1/5
      bg-white border border-gray-300 hover:bg-red-50
      dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-red-900/20
      [&_svg]:stroke-red-600 dark:[&_svg]:stroke-red-400
    `}
          onClick={() => {
            setOpen(true);
            setOrganizationId(item?.id);
          }}
          startIcon={<Trash2 />}
        />
      </div>
    </div>
  );
};

export default React.memo(OrganizationCard);
