import { MyCheckbox, MyInput } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import config from 'configs';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery } from 'hooks/api';
import { get } from 'lodash';
import { Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import AvatarIcon from 'assets/icons/avatar.png';
import MyAvatar from 'components/Atoms/MyAvatar';
import { KeyTypeEnum } from 'enums/key-type.enum';
import Loading from 'assets/icons/Loading';

function EmployeeDragDrop({ doorId }: any) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [check, setCheck] = useState<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dragDrop, setDragDrop] = useState<any>([]);
  const [checkData, setCheckData] = useState<any>([]);
  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.getEmployeeList,
    url: URLS.getEmployeeList,
    params: {
    }
  });

  const handleSubmit = () => {
  };

  const handleSearch = () => {
    if (search) {
      searchParams.set('search', search);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  const handleClickButton = () => {
    setDragDrop(checkData);
  };

  const handleDelete = (idToRemove: any) => {
    const updatedCheckData = dragDrop.filter((item: any) => item.id !== idToRemove);
    setDragDrop(updatedCheckData);
    setCheckData(updatedCheckData);
    setCheck(false);
  };

  return (
    <div
      className={
        'mt-12 min-h-[400px] w-full rounded-m bg-bg-base p-4 shadow-base dark:bg-bg-dark-theme'
      }>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <LabelledCaption
            title={t('Add employees')}
            subtitle={t('Create employees group and link to the door')}
          />
        </div>
        <MyButton onClick={handleSubmit} type="submit" variant="secondary">
          {t('Save changes')}
        </MyButton>
      </div>

      <MyDivider />
      <div className="mt-6 flex w-full gap-4">
        <div className="h-[600px] w-1/2 overflow-y-auto rounded-md border-2 border-solid border-gray-300 bg-gray-100 p-4 dark:border-dark-line dark:bg-bg-dark-theme">
          <div>
            <MyInput
              onKeyUp={(event) => {
                if (event.key === KeyTypeEnum.enter) {
                  handleSearch();
                } else {
                  setSearch(get(event, 'target.value', ''));
                }
              }}
              startIcon={<Search className="stroke-text-muted" onClick={handleSearch} />}
              placeholder={t('Search')}
            />
          </div>
          <div className="mt-4 flex w-full flex-col gap-4">
            <div className="flex items-center justify-between sm:mx-1 lg:mx-4">
              <MyCheckbox
                label={t('Employees')}
                onChange={() => {
                  setCheckData(get(data, 'data.data'));
                  setCheck(true);
                }}
              />
              {checkData?.length > 0 ? (
                <MyButton
                  onClick={handleClickButton}
                  className={'font-medium sm:px-[2px] sm:text-xs lg:px-2 lg:text-sm'}
                  variant="secondary">
                  {t('Add selected employees')}
                </MyButton>
              ) : (
                <MyButton
                  className={'font-medium sm:px-[2px] sm:text-xs lg:px-2 lg:text-sm '}
                  disabled
                  variant="secondary">
                  {t('Add selected employees')}
                </MyButton>
              )}
            </div>
          </div>
        </div>
        <div className="flex h-[600px] w-1/2 flex-col gap-3 overflow-y-auto rounded-md border-2 border-solid border-gray-300 p-4 dark:border-dark-line">
          {dragDrop?.map((evt: any, index: number) => (
            <div className="flex w-full items-center justify-between gap-4 border-b-2 bg-white px-[16px] py-[14px] dark:border-dark-line">
              <div className="flex items-center gap-3" key={index}>
                <MyAvatar
                  imageUrl={evt.photoUrl ? `${config.FILE_URL}${evt?.photoUrl}` : AvatarIcon}
                  size="medium"
                />
                <div className="flex flex-col">
                  <h2 className="text-sm font-normal text-black">
                    {evt.firstName} {evt.lastName}
                  </h2>
                  <p className="text-subtle text-xs font-normal">{evt.middleName}</p>
                </div>
              </div>
              <div
                onClick={() => {
                  handleDelete(evt.id);
                }}
                className="cursor-pointer">
                <Trash2 color="#9CA3AF" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmployeeDragDrop;
