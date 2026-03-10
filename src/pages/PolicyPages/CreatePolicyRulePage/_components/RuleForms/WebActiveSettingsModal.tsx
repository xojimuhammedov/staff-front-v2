import React from 'react';
import { useTranslation } from 'react-i18next';
import MyModal from 'components/Atoms/MyModal';
import { MySelect } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';

interface WebActiveSettingsModalProps {
  open: boolean;
  setOpen: (val: boolean) => void;
  typeValue: string | null;
  selectOptions: any[];
  getValues: (typeValue: string, key: "useful" | "unuseful") => number[];
  handleChange: (typeValue: string, key: "useful" | "unuseful", vals: number[]) => void;
}

const WebActiveSettingsModal: React.FC<WebActiveSettingsModalProps> = ({
  open,
  setOpen,
  typeValue,
  selectOptions,
  getValues,
  handleChange
}) => {
  const { t } = useTranslation();

  return (
    <MyModal
      modalProps={{
        show: Boolean(open),
        onClose: () => {
          setOpen(false);
        }
      }}
      headerProps={{
        children: <h2 className="text-xl font-semibold">{
          typeValue === "WEBSNIFFER" ? t('Policy web visiting') : t('Policy web application')}</h2>,
        className: 'px-6'
      }}
      bodyProps={{
        children: (
          <>
            <div className='flex flex-col gap-4 mt-4'>
              {typeValue && (
                <>
                  <MySelect
                    label={t("Foydali saytlar")}
                    allowedRoles={["ADMIN", "HR", "GUARD", "DEPARTMENT_LEAD"]}
                    isMulti
                    options={selectOptions}
                    value={selectOptions.filter((opt: any) =>
                      getValues(typeValue, "useful").includes(opt.value)
                    )}
                    onChange={(selected: any) => {
                      const items = Array.isArray(selected) ? selected : (selected ? [selected] : []);
                      handleChange(
                        typeValue,
                        "useful",
                        items.map((s: any) => typeof s === 'object' ? s.value : s)
                      );
                    }}
                  />

                  <MySelect
                    label={t("Foydasiz saytlar")}
                    allowedRoles={["ADMIN", "HR", "GUARD", "DEPARTMENT_LEAD"]}
                    isMulti
                    options={selectOptions}
                    value={selectOptions.filter((opt: any) =>
                      getValues(typeValue, "unuseful").includes(opt.value)
                    )}
                    onChange={(selected: any) => {
                      const items = Array.isArray(selected) ? selected : (selected ? [selected] : []);
                      handleChange(
                        typeValue,
                        "unuseful",
                        items.map((s: any) => typeof s === 'object' ? s.value : s)
                      );
                    }}
                  />
                </>
              )}
            </div>
            <div className="mt-2 flex w-full justify-end gap-4 pb-2">
              <MyButton
                onClick={() => {
                  setOpen(false);
                }}
                variant="primary"
              >
                {t("Done")}
              </MyButton>
            </div>
          </>
        )
      }}
    />
  );
};

export default WebActiveSettingsModal;
