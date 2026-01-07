import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useDeleteQuery, useGetOneQuery } from 'hooks/api';
import  { useState } from 'react';
import { useDepartment } from './useDepartment';

export const useDeleteDepartment = () => {
    const [open, setOpen] = useState(false)
    const { refetch } = useDepartment()
    const [departmentId, setDepartmentId] = useState<any | null>(null)
    const { mutate: deleteRequest } = useDeleteQuery({
        listKeyId: KEYS.getAllListDepartment
    });

    const { data: getOne } = useGetOneQuery({
        id: departmentId,
        url: URLS.getAllListDepartment,
        params: {},
        enabled: !!departmentId
    });

    const deleteItem = () => {
        deleteRequest(
            {
                url: `${URLS.getAllListDepartment}/${departmentId}`
            },
            {
                onSuccess: () => {
                    refetch();
                    setOpen(false)
                }
            }
        );
    };

    return {
        deleteItem,
        getOne,
        setDepartmentId,
        setOpen,
        open,
        departmentId
    }
}

