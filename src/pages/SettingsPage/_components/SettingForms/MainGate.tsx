import DataGrid from 'components/Atoms/DataGrid';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import MyBadge from 'components/Atoms/MyBadge';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery } from 'hooks/api';
import { get } from 'lodash';
import TableProvider from 'providers/TableProvider/TableProvider';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useParams } from 'react-router-dom';
import { useSocket } from 'context/SocketProvicer';

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
  const { id } = useParams()
  const socket = useSocket();

  const { data, isLoading } = useGetAllQuery({
    key: KEYS.hikvisionEmployeeSync,
    url: URLS.hikvisionEmployeeSync,
    params: {
      gateId: Number(id)
    }
  })

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'employee',
        label: t('Employee name'),
        headerClassName: 'flex-1',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            {row?.gate?.name}
          </div>
        )
      },
      {
        key: 'isActive',
        label: t('Status'),
        cellRender: (row) => {
          if (row?.status) {
            return (
              <MyBadge variant={row?.status === "ERROR" ? "red" : row?.status === "DONE" ? "green" : 'purple'}>
                {row?.status}
              </MyBadge>
            );
          } else return '--';
        }
      },
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
  ];

  useEffect(() => {
    if (!socket) return;

    const handleNewEmployee = (data: any) => {
      console.log("Serverdan yangi employee:", data);
    };

    socket.on("sync", handleNewEmployee);

    return () => {
      socket.off("sync", handleNewEmployee);
    };
  }, [socket]);

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
          rows: get(data, 'data', []),
          keyExtractor: 'id'
        }}>
        <DataGrid
          hasCustomizeColumns={false}
          hasExport={false}
          hasCheckbox={false}
          isLoading={isLoading}
          dataColumn={dataColumn}
          pagination={data}
        />
      </TableProvider>
    </PageContentWrapper>
  );
}

export default MainGate;
