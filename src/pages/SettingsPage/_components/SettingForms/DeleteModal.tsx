import MyButton from 'components/Atoms/MyButton/MyButton';
import MyModal from 'components/Atoms/MyModal';
import { useTranslation } from 'react-i18next';
import { URLS } from 'constants/url';
import { KEYS } from 'constants/key';
import { useDeleteQuery } from 'hooks/api';
import { toast } from 'react-toastify';

function DeleteModal({ doorId, onClose, show, refetch }: any) {
  const { t } = useTranslation();
  const { mutate: deleteRequest } = useDeleteQuery({
    listKeyId: KEYS.getDoor
  });

  const deleteItem = () => {
    deleteRequest(
      {
        url: `${URLS.getDoor}/${doorId}`
      },
      {
        onSuccess: () => {
          toast.success(t('Door deleted successfully'));
          onClose();
          refetch();
        }
      }
    );
  };
  return (
    <>
      <MyModal
        modalProps={{ show: Boolean(show), onClose: onClose, size: 'md' }}
        headerProps={{
          children: <h2 className="text-xl font-semibold">{t('Employee Delete')}</h2>,
          className: 'px-6'
        }}
        bodyProps={{
          children: (
            <>
              <h2 className="text-center text-xl font-semibold">
                {t('Are you sure you want to delete this employee?')}
              </h2>
              <div className="mb-[5px] mt-6 flex w-full justify-center gap-4">
                <MyButton onClick={deleteItem} variant="primary">
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
