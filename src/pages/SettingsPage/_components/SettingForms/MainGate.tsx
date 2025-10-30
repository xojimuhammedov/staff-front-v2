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
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import MyAvatar from 'components/Atoms/MyAvatar';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
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
                  variant='purple'>
                  {row.status.name}
                </MyBadge>
              </>
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
          rows: [],
          keyExtractor: 'id'
        }}>
        <DataGrid
          hasCustomizeColumns={false}
          hasExport={false}
          hasCheckbox={false}
          isLoading={false}
          dataColumn={dataColumn}
          pagination={[]}
        />
      </TableProvider>
    </PageContentWrapper>
  );
}

export default MainGate;
