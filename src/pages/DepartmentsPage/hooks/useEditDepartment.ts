import { KEYS } from 'constants/key';
import { useGetAllQuery, usePutQuery } from 'hooks/api';
import React, { useEffect, useMemo } from 'react';
import { Department } from '../interface/department.interface';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import { useForm } from 'react-hook-form';
import { useDeleteDepartment } from './useDeleteDepartment';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useDepartment } from './useDepartment';

export const useEditDepartment = ({ onClose }: any) => {
    const { t } = useTranslation()
    const { data: getOrganization } = useGetAllQuery<any>({
        key: KEYS.getAllListOrganization,
        url: URLS.getAllListOrganization,
        hideErrorMsg: true,
        params: {},
    })

    const { data: getDepartment } = useGetAllQuery<{ data: Department[] }>({
        key: KEYS.getAllListDepartment,
        url: URLS.getAllListDepartment,
        params: {}
    })

    const { getOne, departmentId } = useDeleteDepartment()
    const { refetch } = useDepartment()

    const {
        handleSubmit,
        register,
        reset,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: useMemo(() => {
            return {
                fullName: get(getOne, 'data.fullName'),
                shortName: get(getOne, 'data.shortName'),
                email: get(getOne, 'data.email'),
                address: get(getOne, 'data.address'),
                additionalDetails: get(getOne, 'data.additionalDetails'),
                phone: get(getOne, 'data.phone'),
                organizationId: get(getOne, 'data.organizationId'),
                parentId: get(getOne, 'data.parentId')
            };
        }, [getOne]),
        mode: 'onChange',
    });

    useEffect(() => {
        reset({
            fullName: get(getOne, 'data.fullName'),
            shortName: get(getOne, 'data.shortName'),
            email: get(getOne, 'data.email'),
            address: get(getOne, 'data.address'),
            additionalDetails: get(getOne, 'data.additionalDetails'),
            phone: get(getOne, 'data.phone'),
            organizationId: get(getOne, 'data.organizationId'),
            parentId: get(getOne, 'data.parentId')
        });
    }, [getOne]);

    const { mutate: update } = usePutQuery({
        listKeyId: KEYS.getAllListDepartment,
        hideSuccessToast: true
    });

    const onSubmit = (data: any) => {
        update(
            {
                url: `${URLS.getAllListDepartment}/${departmentId}`,
                attributes: data
            },
            {
                onSuccess: () => {
                    toast.success(t('Edit successfully!'));
                    reset();
                    refetch()
                    onClose()
                },
                onError: (e: any) => {
                    console.log(e);
                    toast.error(e?.response?.data?.error?.message)
                }
            }
        );
    };

    return {
        handleSubmit,
        onSubmit,
        register,
        control,
        errors,
        getDepartment,
        getOrganization,
        reset
    }
}

