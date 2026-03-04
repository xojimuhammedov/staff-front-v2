import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery } from 'hooks/api';
import { get } from 'lodash';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import { searchValue } from 'types/search';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { ArrowLeft, Search } from 'lucide-react';
import { useSearch } from 'hooks/useSearch';
import FixIssueModal from 'pages/SettingsPage/_components/SettingForms/FixIssueModal';
import { MyInput } from 'components/Atoms/Form';
import { KeyTypeEnum } from 'enums/key-type.enum';
import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';
import MyBadge from '@/components/Atoms/MyBadge';

function ViewDevice() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const searchValue: searchValue = paramsStrToObj(location?.search);
  const { search, setSearch, handleSearch } = useSearch();
  const { data, isLoading } = useGetAllQuery({
    key: KEYS.hikvisionEmployeeSync,
    url: URLS.hikvisionEmployeeSync,
    params: {
      deviceId: Number(id),
      page: searchValue?.page || 1,
      limit: searchValue?.limit || 10,
      search: searchValue?.search,
      userType: 'EMPLOYEE',
    },
  });

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'employee',
        label: t('Employee name'),
        headerClassName: 'flex-1',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            {row?.employee?.name}
          </div>
        ),
      },
      {
        key: 'organization',
        label: t('Organization name'),
        headerClassName: 'flex-1',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            {row?.organization?.fullName}
          </div>
        ),
      },
      {
        key: 'credential',
        label: t('Credential name'),
        headerClassName: 'flex-1',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            {row?.credential?.type ?? '--'}
          </div>
        ),
      },
      {
        key: 'status',
        label: t('Status'),
        headerClassName: 'flex-1',
        cellRender: (row) => {
          if (row?.status) {
            return (
              <MyBadge
                variant={
                  row?.status === 'FAILED' ? 'red' : row?.status === 'DONE' ? 'green' : 'purple'
                }
              >
                {row?.status}
              </MyBadge>
            );
          } else return '--';
        },
      },
      {
        key: 'message',
        label: t('Check error'),
        headerClassName: 'flex-1',
        cellRender: (row) => <FixIssueModal row={row} />,
      },
    ],
    [t]
  );

  const filteredRows = useMemo(() => {
    const rows = get(data, 'data', []);
    const keyword = (searchValue?.search || '').toString().trim().toLowerCase();

    if (!keyword) return rows;

    return rows.filter((row: any) =>
      (row?.employee?.name || '').toString().toLowerCase().includes(keyword)
    );
  }, [data, searchValue?.search]);

  return (
    <PageContentWrapper>
      <div className={'flex justify-between'}>
        <LabelledCaption title={t('Main gate')} subtitle={t('See and manage door configs')} />
        <div className="flex items-center gap-4">
          <MyInput
            onKeyUp={(event) => {
              if (event.key === KeyTypeEnum.enter) {
                handleSearch();
              } else {
                setSearch((event.target as HTMLInputElement).value);
              }
            }}
            defaultValue={search}
            startIcon={<Search className="stroke-text-muted" onClick={handleSearch} />}
            className="dark:bg-bg-input-dark"
            placeholder={t('Search...')}
          />
          <MyButton
            onClick={() => navigate('/settings?current-setting=deviceControl')}
            variant="primary"
            startIcon={<ArrowLeft />}
            className={`text-sm min-w-max [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
          >
            {t('Back to devices list')}
          </MyButton>
        </div>
      </div>
      <MyDivider />
      <DynamicTable
        data={filteredRows}
        pagination={data}
        columns={columns}
        hasIndex={true}
      />
    </PageContentWrapper>
  );
}

export default ViewDevice;
