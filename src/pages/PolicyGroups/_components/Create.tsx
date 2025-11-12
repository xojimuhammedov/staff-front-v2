import { yupResolver } from '@hookform/resolvers/yup';
import { MyCheckbox, MyInput, MySelect } from 'components/Atoms/Form';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import Button from 'components/Atoms/MyButton';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import MyModal from 'components/Atoms/MyModal';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { ISelect } from 'interfaces/select.interface';
import { get } from 'lodash';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Organization } from 'pages/OrganizationPage/interface/organization.interface';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { object, string } from 'yup';
import * as yup from "yup";

const Create = () => {
    const navigate = useNavigate()
    const { t } = useTranslation();
    const [show, setShow] = useState(false)
    const [inputValue, setInputValue] = useState('');
    const [socialList, setSocialList] = useState<string[]>([]);

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const breadCrumbs = [
        {
            label: t('Policy Groups'),
            url: '#'
        }
    ];
    const { data } = useGetAllQuery<any>({
        key: KEYS.getListOrganizationSelf,
        url: URLS.getListOrganizationSelf,
        params: {}
    })

    const { data: policyResources } = useGetAllQuery<any>({
        key: KEYS.getPolicyResources,
        url: URLS.getPolicyResources,
        params: {}
    })

    const handleCheckboxChange = (id: number, checked: boolean) => {
        if (checked) {
            // ✅ Agar check bo'lsa, id ni qo'shamiz (lekin dublikat bo'lmasin)
            setSelectedIds((prev) => [...new Set([...prev, id])]);
        } else {
            // ❌ Agar uncheck bo'lsa, massivdan o'chiramiz
            setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
        }
    };
    const handleAdd = () => {
        if (!inputValue.trim()) return; // bo‘sh qiymatni saqlamaslik
        setSocialList(prev => [...prev, inputValue.trim()]);
        setInputValue(''); // inputni tozalash
    };

    const schema = object().shape({
        name: string().required(),
        type: string().required(),
        organizationId: yup.number().required(),
    });

    const {
        handleSubmit,
        register,
        reset,
        control,
        formState: { errors }
    } = useForm({
        defaultValues: {},
        mode: 'onChange',
        resolver: yupResolver(schema)
    });

    const { mutate: create } = usePostQuery({
        listKeyId: KEYS.getPolicyGroups,
        hideSuccessToast: true
    });

    const onSubmit = (data: any) => {
        const submitData = {
            ...data,
            resourceIds: selectedIds,
            resources: socialList
        }
        create(
            {
                url: URLS.getPolicyGroups,
                attributes: submitData
            },
            {
                onSuccess: () => {
                    toast.success(t('Successfully created!'));
                    reset();
                    navigate('/policy/groups')
                },
                onError: (e: any) => {
                    console.log(e);
                    toast.error(e?.response?.data?.error?.message)
                }
            }
        );
    };

    return (
        <PageContentWrapper>
            <div className="flex flex-col">
                <h1 className="headers-core dark:text-text-title-dark text-text-base">
                    {t('Policy groups')}
                </h1>
                <MyBreadCrumb items={breadCrumbs} />
            </div>
            <MyDivider />
            <form action="" onSubmit={handleSubmit(onSubmit)} >
                <div className='flex justify-between'>
                    <div className='flex w-1/3 flex-col gap-4'>
                        <MyInput
                            label={t("Group name")}
                            {...register("name")}
                            error={Boolean(errors?.name?.message)}
                            helperText={t(`${errors?.name?.message}`)}
                            placeholder={t("Group name")} />
                        <MyInput
                            label={t("Group type")}
                            {...register("type")}
                            error={Boolean(errors?.type?.message)}
                            helperText={t(`${errors?.type?.message}`)}
                            placeholder={t("Group type")} />
                        <Controller
                            name="organizationId"
                            control={control}
                            render={({ field, fieldState }) => (
                                <MySelect
                                    label={t("Select organization")}
                                    options={data?.map((evt: Organization) => ({
                                        label: evt.fullName,
                                        value: evt.id,
                                    }))}
                                    value={field.value as any}  // 👈 cast to any
                                    onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                                    onBlur={field.onBlur}
                                    error={!!fieldState.error}
                                    required
                                />
                            )}
                        />
                    </div>
                    <div className='h-[600px] w-1/2 overflow-y-auto rounded-md border-2 border-solid border-gray-300 bg-gray-100 p-4'>
                        <div className='flex items-center gap-4'>
                            <MyInput
                                // onKeyUp={(event) => {
                                //     if (event.key === KeyTypeEnum.enter) {
                                //         handleSearch();
                                //     } else {
                                //         setSearch(get(event, 'target.value', ''));
                                //     }
                                // }}
                                startIcon={<Search className="stroke-text-muted" />}
                                placeholder={t('Search')}
                            />
                            <Button
                                onClick={() => setShow(true)}
                                startIcon={<Plus />}
                                variant="primary"
                                className="[&_svg]:stroke-bg-white w-[200px] text-sm">
                                {t('Add resources')}
                            </Button>
                        </div>
                        <div className='flex flex-col gap-2 mt-8'>
                            {
                                get(policyResources, 'data')?.map((item: any) => {
                                    return (
                                        <MyCheckbox
                                            key={item.id}
                                            label={item?.value}
                                            id={item.id}
                                            checked={selectedIds.includes(item.id)}
                                            onChange={(checked: boolean) => handleCheckboxChange(item.id, checked)}
                                        />
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className='flex justify-end mt-4'>
                    <MyButton
                        type='submit'
                        variant="primary">{t("Submit")}</MyButton>
                </div>
            </form>
            <MyModal modalProps={{
                show: Boolean(show),
                onClose: () => {
                    setShow(false)
                }
            }}
                headerProps={{
                    children: <h2 className="text-xl font-semibold">{t('Add social media')}</h2>,
                    className: 'px-6'
                }}
                bodyProps={{
                    children: (
                        <>
                            <div className='flex items-end gap-4'>
                                <MyInput
                                    label={t("Social media")}
                                    className='mt-0'
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={t("Social media")} />
                                <MyButton variant='primary' className={'w-[120px]'} onClick={handleAdd}>{t("Enter")}</MyButton>
                            </div>
                            <div className='flex items-center flex-wrap mt-4 gap-2'>
                                {
                                    socialList?.map((item) => (
                                        <div className='bg-gray-200 p-1 rounded-lg cursor-pointer' key={item}>{item}</div>
                                    ))
                                }
                            </div>
                        </>
                    ),
                    className: "py-4"
                }}
                footerProps={{
                    children: (
                        <div className='flex w-full justify-end'>
                            <MyButton onClick={() => setShow(false)} variant='primary'>Done</MyButton>
                        </div>
                    )
                }}
            />
        </PageContentWrapper>
    );
}

export default Create;
