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
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import AvatarIcon from 'assets/icons/avatar.png';
import MyAvatar from 'components/Atoms/MyAvatar';
import storage from 'services/storage';
import { io } from 'socket.io-client';
import { paramsStrToObj } from 'utils/helper';
import { KeyTypeEnum } from 'enums/key-type.enum';
import Loading from 'assets/icons/Loading';
import { toast } from 'react-toastify';

function EmployeeDragDrop({ doorId }: any) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [check, setCheck] = useState<any>();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const userDataString: string | null = storage.get('userData');
  const companyId: any = userDataString ? JSON.parse(userDataString) : {};
  const [status, setStatus] = useState<any>();
  const firstName: any = paramsStrToObj(location?.search);
  const [dragDrop, setDragDrop] = useState<any>([]);
  const [checkData, setCheckData] = useState<any>([]);
  const socketEnv: any = config.API_ROOT;
  const token = storage.get('accessToken');
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.getEmployee,
    url: URLS.getEmployee,
    params: {
      fields: ['firstName', 'lastName', 'middleName', 'photoUrl', 'empDeviceId'],
      pagination: {
        pageSize: 1000
      },
      filters: {
        $or: {
          [0]: {
            firstName: {
              $containsi: get(firstName, 'search')
            }
          },
          [1]: {
            lastName: {
              $containsi: get(firstName, 'search')
            }
          }
        }
      }
    }
  });

  useEffect(() => {
    const socket = io(socketEnv, {
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    socket.on('connect', () => {
      console.log('Connected.');
    });

    socket.emit('door-face-upload', {
      employees: dragDrop,
      door: [doorId?.deviceId],
      func: 'Create',
      companyId: get(companyId, 'company.id')
    });

    socket.on('door-face-upload', (data: any) => {
      setStatus(data);
    });

    socket.on('message', (data: any) => {
      console.log(data);
    });
    socket.on('employee-check-in', (data: any) => {
      console.log(data);
    });

    socket.on('error', (data: any) => {
      console.log(data);
    });

    socket.on('disconnect', () => {
      console.log('Disconnect.');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (evt: any) => {
    evt.preventDefault();
    const socket = io(socketEnv, {
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    socket.emit('door-face-upload', {
      employees: dragDrop,
      door: [doorId?.deviceId],
      func: 'Create',
      companyId: get(companyId, 'company.id')
    });

    socket.on('door-face-upload', (data: any) => {
      setStatus(data);
      console.log(data);
      {
        data?.success
          ? toast.success(t("Muvaffaqiyatli qo'shildi!"))
          : toast.error(t('An error occurred!'));
      }
      {
        data?.success ? navigate('/settings') : '';
      }
    });
    {
      status?.success ? navigate('/settings') : '';
    }
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
            {isLoading ? (
              <div className="absolute flex h-full w-full items-center justify-center">
                <Loading />
              </div>
            ) : (
              <>
                {get(data, 'data.data')?.map((evt: any, index: any) => {
                  const isChecked = dragDrop.includes(evt?.id);
                  return (
                    <div
                      className={`${
                        dragDrop.find((item: any) => item.id === evt.id) ? 'hidden' : 'block'
                      }`}>
                      <div
                        key={index}
                        className={`flex w-full items-center gap-4 border-b-2 bg-white px-[16px] py-[14px] dark:border-dark-line dark:bg-bg-dark-bg`}>
                        <MyCheckbox
                          // checked={check}
                          defaultChecked={check}
                          onChange={(item) => {
                            if (item.target.checked === true) {
                              setCheckData((prev: any[]) => {
                                return [...prev, evt];
                              });
                            } else {
                              setCheckData((prev: any[]) => {
                                return prev?.filter((item: any) => item.id !== evt.id);
                              });
                            }
                          }}
                          id={evt.id}
                        />
                        <div className="flex items-center gap-2">
                          <MyAvatar
                            imageUrl={
                              evt.photoUrl ? `${config.FILE_URL}${evt?.photoUrl}` : AvatarIcon
                            }
                            size="medium"
                          />
                          <div className="flex flex-col">
                            <h2 className="text-sm font-normal text-black dark:text-text-title-dark">
                              {evt.firstName} {evt.lastName}
                            </h2>
                            <p className="text-subtle text-xs font-normal dark:text-text-title-dark">
                              {evt.middleName}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
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
