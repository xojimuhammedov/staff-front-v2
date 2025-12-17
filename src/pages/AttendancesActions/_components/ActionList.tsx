import TableProvider from 'providers/TableProvider/TableProvider';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from 'components/Atoms/DataGrid';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { IFilter } from 'interfaces/filter.interface';
import { IAction } from 'interfaces/action.interface';
import { getTimeDifference, paramsStrToObj } from 'utils/helper';
import MyAvatar from 'components/Atoms/MyAvatar';
import MyBadge from 'components/Atoms/MyBadge';
import config from 'configs';
import dayjs from 'dayjs';
import AvatarIcon from '../../../assets/icons/avatar.jpg'
import { searchValue } from 'types/search';


const ActionList = ({ watch }: any) => {
    const { t } = useTranslation();
    const location = useLocation()
    const searchValue: searchValue = paramsStrToObj(location.search)
    const { id } = useParams()

    const { data, isLoading } = useGetAllQuery({
        key: KEYS.actionAttendancesList,
        url: URLS.actionAttendancesList,
        params: {
            search: searchValue?.search,
            page: searchValue?.page || 1,
            limit: searchValue?.pageSize || 10,
            employeeId: id,
        }
    });
    const columns: DataGridColumnType[] = useMemo(
        () => [
            {
                key: 'fullName',
                label: t('Employee name'),
                headerClassName: 'w-1/3',
                cellRender: (row) => (
                    <div className="flex items-center gap-4 dark:text-text-title-dark">
                        <MyAvatar size="medium" imageUrl={row?.employee?.photo ? `${config.FILE_URL}api/storage/${row?.employee?.photo}` : AvatarIcon} />
                        {row?.employee?.name}
                    </div>
                )
            },
            {
                key: 'actionType',
                label: t('Action type'),
                headerClassName: 'w-1/4',
            },
            {
                key: 'entryType',
                label: t('Entry type'),
                headerClassName: 'w-1/4',
            },
            {
                key: 'actionTime',
                label: t('Action time'),
                headerClassName: 'w-1/4',
                cellRender: (row) => {
                    if (row?.actionTime) {
                        return (
                            <div className="department-text">{dayjs(row.actionTime).format("YYYY-MM-DD, HH:mm")}</div>
                        )
                    } else return "--"
                }
            },
            {
                key: 'credential',
                label: t('Credential type'),
                headerClassName: 'w-1/4',
                cellRender: (row) => {
                    if (row?.credential) {
                        return (
                            <div className="department-text">{row?.credential?.name}</div>
                        )
                    } else return "--"
                }
            },
        ],
        [t]
    );

    const dataColumn = [
        {
            id: 1,
            label: t('Employee name'),
            headerClassName: 'w-1/3'
        },
        {
            id: 2,
            label: t('Action type'),
            headerClassName: 'w-1/4'
        },
        {
            id: 3,
            label: t('Entry type'),
            headerClassName: 'w-1/4'
        },
        {
            id: 4,
            label: t('Work on time'),
            headerClassName: 'w-1/4'
        },
        {
            id: 5,
            label: t('Credential type'),
            headerClassName: 'w-1/4'
        },
    ];

    const filter: IFilter[] = useMemo(
        () => [],
        [t]
    )
    const rowActions: IAction[] = useMemo(
        () => [],
        [t]
    );

    if (isLoading) {
        return (
            <div className="absolute flex h-full w-full items-center justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <>
            <TableProvider<IEmployee, IFilter[]>
                values={{
                    columns,
                    filter,
                    rows: get(data, 'data', []),
                    keyExtractor: 'id'
                }}>
                <DataGrid
                    isLoading={isLoading}
                    hasAction={false}
                    hasCustomizeColumns={true}
                    dataColumn={dataColumn}
                    rowActions={rowActions}
                    pagination={data}
                />
            </TableProvider>
        </>
    );
};

export default ActionList;
