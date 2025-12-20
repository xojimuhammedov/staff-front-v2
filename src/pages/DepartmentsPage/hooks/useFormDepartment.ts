import { yupResolver } from '@hookform/resolvers/yup';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import storage from 'services/storage';
import { object, string } from 'yup';
import * as yup from "yup";
import { useDepartment } from './useDepartment';
import { Department } from '../interface/department.interface';

export const useFormDepartment = ({ onClose }: any) => {
    const { t } = useTranslation()
    const userData: any = storage.get("userData")
    const userRole = JSON.parse(userData)?.role
    const { refetch } = useDepartment()

    const schema = object().shape({
        fullName: string().required(),
        shortName: string().required(),
        email: string(),
        address: string(),
        additionalDetails: string(),
        phone: string(),
        organizationId: yup
            .number()
            .when('$role', (role: any, schema) =>
                role === 'ADMIN' ? schema.required() : schema.optional()
            ),
        parentId: yup.number()
    });

    const {
        handleSubmit,
        register,
        reset,
        control,
        watch,
        formState: { errors }
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
        context: { role: userRole }
    });

    const { mutate: create } = usePostQuery({
        listKeyId: KEYS.getAllListDepartment,
        hideSuccessToast: true
    });

    const { data: getDepartment } = useGetAllQuery<{ data: Department[] }>({
        key: KEYS.getAllListDepartment,
        url: URLS.getAllListDepartment,
        params: {
            organizationId: watch("organizationId")
        }
    })

    const { data } = useGetAllQuery<any>({
        key: KEYS.getAllListOrganization,
        url: URLS.getAllListOrganization,
        hideErrorMsg: true,
        params: {},
    })

    const onSubmit = (data: any) => {
        create(
            {
                url: URLS.getAllListDepartment,
                attributes: data
            },
            {
                onSuccess: () => {
                    toast.success(t('Successfully created!'));
                    reset();
                    refetch()
                    // onClose()
                },
                onError: (e: any) => {
                    console.log(e);
                    toast.error(e?.response?.data?.error?.message)
                }
            }
        );
    };

    return {
        register,
        handleSubmit,
        onSubmit,
        control,
        watch,
        errors,
        reset,
        getDepartment,
        data
    }

}

