import DataGrid from 'components/Atoms/DataGrid';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import MyBadge from 'components/Atoms/MyBadge';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { get } from 'lodash';
import TableProvider from 'providers/TableProvider/TableProvider';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import MyModal from 'components/Atoms/MyModal';
import FixIssueModal from './FixIssueModal';
import MyAvatar from 'components/Atoms/MyAvatar';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useLocation, useParams } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import config from 'configs';
import { io } from 'socket.io-client';
import storage from 'services/storage';
import Loading from 'assets/icons/Loading';

type FilterType = {
  search: string;
};

type TItem = {
  employeeName: string;
  status: string;
  timeline: string;
  action: string;
  id: string;
};

function MainGate() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const location = useLocation();
  const page: any = paramsStrToObj(location.search);
  const firstName: any = paramsStrToObj(location?.search);
  const pageSize: any = paramsStrToObj(location.search);
  const socketEnv: any = config.API_ROOT;
  const token = storage.get('accessToken');

  const [doorData, setDoorData] = useState<any>();
  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.getDoorFaceUploads,
    url: URLS.getDoorFaceUploads,
    params: {
      populate: '*',
      filters: {
        door: Number(id),
        $or: [
          {
            employee: {
              firstName: {
                $containsi: get(firstName, 'search')
              }
            }
          },
          {
            employee: {
              lastName: {
                $containsi: get(firstName, 'search')
              }
            }
          },
          {
            employee: {
              middleName: {
                $containsi: get(firstName, 'search')
              }
            }
          }
        ]
      },
      pagination: {
        pageSize: Number(pageSize?.pageSize) || 10,
        page: Number(page?.page) || 1
      },
      sort: [
        {
          status: {
            order: 'asc'
          }
        },
        {
          employee: {
            lastName: 'asc'
          }
        }
      ]
    }
  });

  const handleSubmit = (data: any) => {
    const socket = io(socketEnv, {
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    socket.emit('door-face-upload', {
      employees: [data?.employee],
      door: [data?.door?.id],
      func: 'Delete',
      isDelete: true
    });

    socket.on('door-face-upload', (data: any) => {
      console.log(data);
      {
        data.success ? refetch() : '';
      }
      {
        data.success ? toast.success(t('Muvaffaqiyatli o`chirildi!')) : '';
      }
    });
    // {
    //   data.success ? refetch() : '';
    // }
    // {
    //   data.success ? toast.success(t("Muvaffaqiyatli o`chirildi!")) : '';
    // }
  };

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'employee',
        label: t('Employee name'),
        headerClassName: 'flex-1',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            <MyAvatar size="medium" imageUrl={row?.employee?.photoBase64} />
            {row?.employee?.lastName} {row?.employee?.firstName} {row?.employee?.middleName}
          </div>
        )
      },
      {
        key: 'isActive',
        label: t('Status'),
        cellRender: (row) => {
          if (row.status) {
            return (
              <>
                <MyBadge
                  variant={
                    row.status.name === 'Active'
                      ? 'green'
                      : row.status.name === 'Error'
                        ? 'red'
                        : row.status.name === 'On progress'
                          ? 'purple'
                          : row.status.name === 'Waiting'
                            ? 'neutral'
                            : 'purple'
                  }>
                  {row.status.name}
                </MyBadge>
              </>
            );
          } else return '--';
        }
      },
      {
        key: 'lastActive',
        label: t('Action'),
        cellRender: (row) => {
          if (row.status) {
            return (
              <>
                {row?.status?.name === 'Error' ? (
                  <MyButton
                    onClick={() => {
                      setDoorData(row);
                      setOpenModal(true);
                    }}
                    className="w-[98px] font-medium"
                    variant="secondary">
                    {t('Fix issue')}
                  </MyButton>
                ) : row?.status?.name === 'Active' ? (
                  <MyButton
                    onClick={() => handleSubmit(row)}
                    type="submit"
                    startIcon={<Trash2 />}
                    className="w-[98px] font-medium"
                    variant="secondary">
                    {t('Remove')}
                  </MyButton>
                ) : (
                  <MyButton
                    disabled
                    // type="submit"
                    // onClick={() => handleSubmit(row)}
                    startIcon={<Trash2 />}
                    className="w-[98px] font-medium"
                    variant="secondary">
                    {t('Remove')}
                  </MyButton>
                )}
              </>
            );
          } else return '--';
        }
      }
    ],
    [t]
  );

  const dataColumn = [
    {
      id: 1,
      label: t('Employee name'),
      headerClassName: 'flex-1'
    },
    {
      id: 2,
      label: t('Status')
    },
    {
      id: 3,
      label: t('Action')
    }
  ];

  if (isLoading) {
    return (
      <div className="absolute flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <PageContentWrapper>
      <div className={'flex justify-between'}>
        <LabelledCaption title={t('Main gate')} subtitle={t('See and manage door configs')} />
      </div>
      <MyDivider />
      <TableProvider<TItem, FilterType>
        values={{
          columns,
          filter: { search: '' },
          rows: get(data, 'data.data', []),
          keyExtractor: 'id'
        }}>
        <DataGrid
          hasCustomizeColumns={false}
          hasExport={false}
          hasCheckbox={false}
          isLoading={isLoading}
          dataColumn={dataColumn}
          pagination={get(data, 'data.meta.pagination', {})}
        />
      </TableProvider>

      <MyModal
        modalProps={{
          show: Boolean(openModal),
          onClose: () => setOpenModal(false),
          size: 'md'
        }}
        headerProps={{
          children: (
            <h2 className="text-20 leading-32 font-inter tracking-tight text-black">
              {t('Fix issue')}
            </h2>
          )
        }}
        bodyProps={{
          children: (
            <FixIssueModal refetch={refetch} setOpenModal={setOpenModal} doorData={doorData} />
          ),
          className: 'py-[10px]'
        }}
      />
    </PageContentWrapper>
  );
}

export default MainGate;
