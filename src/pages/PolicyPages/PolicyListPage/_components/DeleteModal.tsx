import MyButton from 'components/Atoms/MyButton/MyButton';
import MyModal from 'components/Atoms/MyModal';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useDeleteQuery } from 'hooks/api';

function DeleteModal({ workScheduleId, onClose, show }: any) {
  const { t } = useTranslation();

  const { mutate: deleteRequest } = useDeleteQuery({
    listKeyId: KEYS.getPolicyList
  });

  const deleteItem = () => {
    deleteRequest(
      {
        url: `${URLS.getPolicyList}/${workScheduleId}`
      },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  return (
    <>
      <MyModal
        modalProps={{ show: Boolean(show), onClose: onClose, size: 'md' }}
        headerProps={{
          children: <h2 className="text-xl font-semibold">{t('WorkSchedule Delete')}</h2>,
          className: 'px-6'
        }}
        bodyProps={{
          children: (
            <>
              <h2 className="text-center text-xl font-semibold">
                {t('Are you sure you want to delete this workschedule?')}
              </h2>
              <div className="mb-[5px] mt-6 flex w-full justify-center gap-4">
                <MyButton onClick={deleteItem} type="submit" variant="primary">
                  {' '}
                  {t('Delete')}
                </MyButton>
                <MyButton className="w-[98px]" onClick={onClose} variant="secondary">
                  {' '}
                  {t('Close')}
                </MyButton>
              </div>
            </>
          ),
          className: 'px-[20px]'
        }}
      />
    </>
  );
}

export default DeleteModal;
