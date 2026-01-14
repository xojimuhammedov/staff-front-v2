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
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import { searchValue } from 'types/search';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { ArrowLeft } from 'lucide-react';
import { useSearch } from 'hooks/useSearch';
import FixIssueModal from 'pages/SettingsPage/_components/SettingForms/FixIssueModal';

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

function ViewDevice() {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const { id } = useParams()
    const location = useLocation()
    const searchValue: searchValue = paramsStrToObj(location?.search)
    // const { search, setSearch, handleSearch } = useSearch();
    const { data, isLoading } = useGetAllQuery({
        key: KEYS.hikvisionEmployeeSync,
        url: URLS.hikvisionEmployeeSync,
        params: {
            deviceId: Number(id),
            page: searchValue?.page || 1,
            limit: searchValue?.limit || 10,
            search: searchValue?.search,
            userType: "EMPLOYEE"
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
                        {row?.employee?.name}
                    </div>
                )
            },
            {
                key: 'organization',
                label: t('Organization name'),
                headerClassName: 'flex-1',
                cellRender: (row) => (
                    <div className="flex items-center gap-4 dark:text-text-title-dark">
                        {row?.organization?.fullName}
                    </div>
                )
            },
            {
                key: 'credential',
                label: t('Credential name'),
                headerClassName: 'flex-1',
                cellRender: (row) => (
                    <div className="flex items-center gap-4 dark:text-text-title-dark">
                        {row?.credential?.type ?? "--"}
                    </div>
                )
            },
            {
                key: 'status',
                label: t('Status'),
                headerClassName: 'flex-1',
                cellRender: (row) => {
                    if (row?.status) {
                        return (
                            <MyBadge variant={row?.status === "FAILED" ? "red" : row?.status === "DONE" ? "green" : 'purple'}>
                                {row?.status}
                            </MyBadge>
                        );
                    } else return '--';
                }
            },
            {
                key: "message",
                label: t("Check error"),
                headerClassName: 'flex-1',
                cellRender: (row) =>
                    <FixIssueModal row={row} />
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
            label: t('Organization name'),
            headerClassName: 'flex-1'
        },
        {
            id: 3,
            label: t('Type'),
            headerClassName: 'flex-1',
        },
        {
            id: 4,
            label: t('Status'),
            headerClassName: 'flex-1',
        },
        {
            id: 5,
            label: t("Check error"),
            headerClassName: 'flex-1',
        }
    ];

    return (
        <PageContentWrapper>
            <div className={'flex justify-between'}>
                <LabelledCaption title={t('Main gate')} subtitle={t('See and manage door configs')} />
                <div className='flex items-center gap-4'>
                    <MyButton
                        onClick={() => navigate('/settings?current-setting=deviceControl')}
                        variant="secondary"
                        startIcon={<ArrowLeft />}>
                        {t('Back to devices list')}
                    </MyButton>
                </div>
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

export default ViewDevice;
