import { MyInput } from 'components/Atoms/Form';
import MyModal from 'components/Atoms/MyModal';
import { useTranslation } from 'react-i18next';
import MyButton from 'components/Atoms/MyButton/MyButton';

type EditModalProps = {
  open: boolean;
  onClose: () => void;
  editType: string;
  editValue: string;
  onEditValueChange: (value: string) => void;
  onSave: () => void;
};

const EditModal = ({
  open,
  onClose,
  editType,
  editValue,
  onEditValueChange,
  onSave,
}: EditModalProps) => {
  const { t } = useTranslation();
  const isCard = editType === 'CARD';
  const isCar = editType === 'CAR';
  const label = isCard ? t('Card Number') : isCar ? t('Car Number') : t('Personal Code');
  const isSaveDisabled = !editValue?.trim();

  return (
    <MyModal
      modalProps={{
        show: Boolean(open),
        onClose,
        size: 'md',
      }}
      headerProps={{
        children: (
          <h2 className="text-xl font-semibold text-text-base dark:text-text-title-dark">
            {t('Edit credential')}
          </h2>
        ),
        className: 'px-6',
      }}
      bodyProps={{
        children: (
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (isSaveDisabled) return;
              onSave();
            }}
          >
            <MyInput
              label={label}
              value={editValue}
              onChange={(e) => onEditValueChange(e.target.value)}
              autoFocus
              required
            />
            <div className="flex items-center justify-end gap-3">
              <MyButton type="submit" variant="primary" disabled={isSaveDisabled}>
                {t('Save changes')}
              </MyButton>
              <MyButton variant="secondary" onClick={onClose}>
                {t('Close')}
              </MyButton>
            </div>
          </form>
        ),
        className: 'py-[10px]',
      }}
    />
  );
};

export default EditModal;
