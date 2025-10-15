import { MyCheckbox } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, useGetOneQuery, usePostQuery } from 'hooks/api';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditEmployeeGroup = () => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const { t } = useTranslation()
    const { id }: any = useParams();
    const navigate = useNavigate()

    const { data: getOnePolicy } = useGetOneQuery({
        id: id,
        url: URLS.getPolicyList,
        params: {},
        enabled: !!id
    })

    const { data } = useGetAllQuery<any>({
        key: KEYS.getEmployeeList,
        url: URLS.getEmployeeList,
        params: {}
    });

    const {
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {},
        mode: 'onChange',
    });

    const { mutate: create } = usePostQuery({
        listKeyId: KEYS.employeeBulk,
        hideSuccessToast: true
    });

    const onSubmit = () => {
        const submitData = {
            policyId: Number(id),
            employeeIds: selectedIds,
        }
        create(
            {
                url: URLS.employeeBulk,
                attributes: submitData
            },
            {
                onSuccess: () => {
                    toast.success(t('Successfully updated!'));
                    navigate('/policy')
                },
                onError: (e: any) => {
                    console.log(e);
                    toast.error(e?.response?.data?.error?.message)
                }
            }
        );
    };

    useEffect(() => {
        if (getOnePolicy?.data?.employees?.length) {
            const ids = getOnePolicy?.data?.employees?.map((item: any) => item.id);
            setSelectedIds(ids);
        }
    }, [getOnePolicy?.data]);

    // Barcha IDlarni olish
    const allIds = data?.data?.map((item: any) => item?.id) || [];

    // Barchasini tanlash / bekor qilish
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    };

    // Bitta checkbox o‘zgarganda
    const handleSelectOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, id]);
        } else {
            setSelectedIds((prev) => prev.filter((i) => i !== id));
        }
    };

    // Barchasi tanlanganligini aniqlash
    const isAllSelected =
        allIds.length > 0 && selectedIds.length === allIds.length;
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <LabelledCaption
                title={t('Add employees to group')}
                subtitle={t('Short description describing this collection')}
            />
            <div className='border p-4 mt-8 rounded-lg'>
                <div className='grid grid-cols-3 w-full'>
                    <div className='flex items-center gap-2'>
                        <MyCheckbox checked={isAllSelected}
                            onChange={(checked) => handleSelectAll(checked)} label='Employee' />
                    </div>
                    <div>Department</div>
                    <div>Phone</div>
                </div>
                <MyDivider />
                {
                    data?.data?.map((item: any) => (
                        <div key={item?.id} className='grid grid-cols-3 my-6 w-full'>
                            <div>
                                <MyCheckbox
                                    label={item?.name}
                                    checked={selectedIds.includes(item?.id)}
                                    onChange={(checked) => handleSelectOne(item?.id, checked)} />
                            </div>
                            <div>{item?.department?.shortName}</div>
                            <div>{item?.phone}</div>
                        </div>
                    ))
                }
            </div>
            <div className="flex justify-end mt-4">
                <MyButton type="submit" variant="primary">
                    {t('Create')}
                </MyButton>
            </div>
        </form>
    );
}

export default EditEmployeeGroup;
