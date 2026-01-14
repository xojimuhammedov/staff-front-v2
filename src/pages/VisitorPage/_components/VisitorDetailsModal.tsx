import MyModal from 'components/Atoms/MyModal';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { CheckCircle, User, Phone, MapPin, Calendar, Building2, Briefcase, FileText, Hash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VisitorDetailsModalProps {
  show: boolean;
  onClose: () => void;
  visitor: any;
  organizationData?: any;
  employeeData?: any;
}

const VisitorDetailsModal = ({
  show,
  onClose,
  visitor,
  organizationData,
  employeeData,
}: VisitorDetailsModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getOrganizationName = (id: number) => {
    return organizationData?.data?.find((org: any) => org.id === id)?.fullName || '--';
  };

  const getEmployeeName = (id: number) => {
    return employeeData?.data?.find((emp: any) => emp.id === id)?.name || '--';
  };

  if (!visitor) return null;

  return (
    <MyModal
      modalProps={{
        show: Boolean(show),
        onClose,
      }}
      headerProps={{
        children: (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-base dark:text-text-title-dark">
                {t('Visitor Created Successfully')}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {t('Visitor information has been saved')}
              </p>
            </div>
          </div>
        ),
        className: 'px-6 py-4 border-b border-gray-200 dark:border-gray-700',
      }}
      bodyProps={{
        children: (
          <div className="p-6">
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                    {t('Full Name')}
                  </p>
                  <p className="text-base font-medium text-text-base dark:text-text-title-dark">
                    {visitor.firstName || '--'} {visitor.lastName || '--'}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Phone className="text-gray-400" size={14} />
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {t('Phone Number')}
                    </p>
                  </div>
                  <p className="text-base font-medium text-text-base dark:text-text-title-dark">
                    {visitor.phone || '--'}
                  </p>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                <Briefcase className="text-orange-600 dark:text-orange-400" size={20} />
                <h3 className="text-lg font-semibold text-text-base dark:text-text-title-dark">
                  {t('Work Information')}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1.5">
                    <MapPin className="text-gray-400" size={14} />
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      {t('Work Place')}
                    </p>
                  </div>
                  <p className="text-base font-medium text-text-base dark:text-text-title-dark">
                    {visitor.workPlace || '--'}
                  </p>
                </div>
                {visitor.organizationId && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Building2 className="text-gray-400" size={14} />
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {t('Organization')}
                      </p>
                    </div>
                    <p className="text-base font-medium text-text-base dark:text-text-title-dark">
                      {getOrganizationName(visitor.organizationId)}
                    </p>
                  </div>
                )}
                {visitor.attachId && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1.5">
                      <User className="text-gray-400" size={14} />
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {t('Attached Employee')}
                      </p>
                    </div>
                    <p className="text-base font-medium text-text-base dark:text-text-title-dark">
                      {getEmployeeName(visitor.attachId)}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <MyButton onClick={() => navigate('/visitor')} variant="primary" className="min-w-[120px]">
                {t('Done')}
              </MyButton>
            </div>
          </div>
        ),
      }}
    />
  );
};

export default VisitorDetailsModal;
