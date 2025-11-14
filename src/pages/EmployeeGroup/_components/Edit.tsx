import { MyCheckbox, MyInput, MySelect, MyTextarea } from 'components/Atoms/Form';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, useGetOneQuery, usePostQuery, usePutQuery } from 'hooks/api';
import { ISelect } from 'interfaces/select.interface';
import { get } from 'lodash';
import { ArrowLeft } from 'lucide-react';
import { Organization } from 'pages/OrganizationPage/interface/organization.interface';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmployeeGroupEdit = () => {
    const { id } = useParams()
    const { t } = useTranslation()
    const navigate = useNavigate()

    const breadCrumbs = [
        {
            label: t('Employees'),
            url: '#'
        }
    ];

    const { data: employeeGroup } = useGetOneQuery({
        id: id,
        url: URLS.getEmployeeGroups,
        params: {},
        enabled: !!id
    })
    const { data: policyList } = useGetAllQuery<any>({
        key: KEYS.getPolicyList,
        url: URLS.getPolicyList,
        params: {}
    });

    const { data } = useGetAllQuery<any>({
        key: KEYS.getEmployeeList,
        url: URLS.getEmployeeList,
        params: {}
    });

    const { data: organizationData } = useGetAllQuery<any>({
        key: KEYS.getListOrganizationSelf,
        url: URLS.getListOrganizationSelf,
        params: {}
    })

    const {
        handleSubmit,
        register,
        control,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: useMemo(() => {
            return {
                name: get(employeeGroup, 'data.name'),
                description: get(employeeGroup, 'data.description'),
                organizationId: get(employeeGroup, 'data.organizationId'),
                policyId: get(employeeGroup, 'data.policyId')
            };
        }, [employeeGroup?.data]),
        mode: 'onChange',
    });
    useEffect(() => {
        reset({
            name: get(employeeGroup, 'data.name'),
            description: get(employeeGroup, 'data.description'),
            organizationId: get(employeeGroup, 'data.organizationId'),
            policyId: get(employeeGroup, 'data.policyId')
        });
    }, [employeeGroup?.data]);

    const { mutate: create } = usePutQuery({
        listKeyId: KEYS.getEmployeeGroups,
        hideSuccessToast: true
    });

    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    useEffect(() => {
        if (employeeGroup?.data?.employees?.length) {
            const ids = employeeGroup?.data?.employees?.map((item: any) => item.id);
            setSelectedIds(ids);
        }
    }, [employeeGroup?.data]);

    const onSubmit = (data: any) => {
        const submitData = {
            employees: selectedIds,
            ...data
        }
        create(
            {
                url: `${URLS.getEmployeeGroups}/${id}`,
                attributes: submitData
            },
            {
                onSuccess: () => {
                    toast.success(t('Successfully updated!'));
                    reset();
                    navigate('/employee-group')
                },
                onError: (e: any) => {
                    console.log(e);
                    toast.error(e?.response?.data?.error?.message)
                }
            }
        );
    };

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
    const handleSelectOne = (id: string, checked: boolean) => {
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
        <PageContentWrapper>
            <div className="flex flex-col">
                <h1 className="headers-core text-text-base dark:text-text-title-dark">
                    {t('Add new employee')}
                </h1>
                <MyBreadCrumb items={breadCrumbs} />
            </div>
            <MyDivider />
            <MyButton
                onClick={() => navigate('/employee-group')}
                variant="secondary"
                startIcon={<ArrowLeft />}>
                {t('Back to employee group list')}
            </MyButton>
            <MyDivider />
            <form className='max-w-5xl' onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-12 flex w-full items-start justify-between">
                    <LabelledCaption
                        className="flex-1"
                        title={t('Group name')}
                        subtitle={t('Short and easy-to-understand name')}
                    />
                    <MyInput
                        rootClassName="max-w-[462px]"
                        placeholder={t('Enter group name')}
                        {...register("name")}
                        error={Boolean(errors?.name?.message)}
                        helperText={t(`${errors?.name?.message}`)}
                    />
                </div>
                <div className="mb-12 flex w-full items-start justify-between">
                    <LabelledCaption
                        className="flex-1"
                        title={t('Group name')}
                        subtitle={t('Short description describing this collection')}
                    />
                    <MyTextarea
                        rootClassName="max-w-[462px]"
                        placeholder={t('Enter group description')}
                        {...register("description")}
                        error={Boolean(errors?.description?.message)}
                        helperText={t(`${errors?.description?.message}`)}
                    />
                </div>
                <div className="mb-12 flex w-full items-start justify-between">
                    <LabelledCaption
                        className="flex-1"
                        title={t('Organization')}
                        subtitle={t('')}
                    />
                    <div className='w-[462px]'>
                        <Controller
                            name="organizationId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <MySelect
                                    options={organizationData?.map((evt: Organization) => ({
                                        label: evt.fullName,
                                        value: evt.id,
                                    }))}
                                    placeholder='Select organization'
                                    value={field.value as any}  // 👈 cast to any
                                    onChange={(val) => field.onChange((val as ISelect)?.value ?? val)}
                                    onBlur={field.onBlur}
                                    error={!!fieldState.error}
                                    required
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="mb-12 flex w-full items-start justify-between">
                    <LabelledCaption
                        className="flex-1"
                        title={t('Policy')}
                        subtitle={t('')}
                    />
                    <div className='w-[462px]'>
                        <Controller
                            name="policyId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <MySelect
                                    options={policyList?.data?.map((evt: any) => ({
                                        label: evt.title,
                                        value: evt.id,
                                    }))}
                                    placeholder='Select policy'
                                    value={field.value as any}  // 👈 cast to any
                                    onChange={(val) => field.onChange((val as ISelect)?.value ?? val)}
                                    onBlur={field.onBlur}
                                    error={!!fieldState.error}
                                    required
                                />
                            )}
                        />
                    </div>
                </div>
                <MyDivider />
                <LabelledCaption
                    title={t('Add employees to group')}
                    subtitle={t('Short description describing this collection')}
                />
                <MyDivider />
                <div className='border rounded-lg'>
                    <div className='grid grid-cols-3 w-full bg-[#F9FAFB] p-4'>
                        <div className='flex items-center gap-2'>
                            <MyCheckbox checked={isAllSelected}
                                onChange={(checked) => handleSelectAll(checked)} label='Employee' />
                        </div>
                        <div>Department</div>
                        <div>Phone</div>
                    </div>
                    <div className='px-4'>
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
                </div>
                <div className="flex justify-end mt-4">
                    <MyButton type="submit" variant="primary">
                        {t('Update')}
                    </MyButton>
                </div>
            </form>
        </PageContentWrapper>
    );
}

export default EmployeeGroupEdit;
