import { MyInput } from 'components/Atoms/Form';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePutQuery } from 'hooks/api';
import { get } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import { Eye, EyeOff } from 'lucide-react';

function Form() {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [newShowPassword, setNewShowPassword] = useState(false)
    const { data } = useGetAllQuery({
        key: KEYS.getUsersMe,
        url: URLS.getUsersMe,
        params: {},
    })
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: useMemo(() => {
            return {
                name: get(data, 'name'),
                username: get(data, 'username'),
                currentPassword: get(data, 'currentPassword'),
                newPassword: get(data, 'newPassword'),
            };
        }, [data]),
        mode: 'onChange',
    });

    useEffect(() => {
        reset({
            name: get(data, 'name'),
            username: get(data, 'username'),
            currentPassword: get(data, 'currentPassword'),
            newPassword: get(data, 'newPassword'),
        });
    }, [data]);

    const { mutate: update } = usePutQuery({
        listKeyId: KEYS.getUsersMe,
        hideSuccessToast: true
    });

    const onSubmit = (data: any) => {
        update(
            {
                url: URLS.getUsersMe,
                attributes: data
            },
            {
                onSuccess: () => {
                    toast.success(t('Successfully edited!'));
                    reset();
                },
                onError: (e: any) => {
                    console.log(e);
                    toast.error(e?.response?.data?.error?.message)
                }
            }
        );
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='w-2/3 flex justify-between'>
                    <div className='grid grid-cols-2 gap-4 w-3/4'>
                        <MyInput
                            {...register("name")}
                            error={Boolean(errors?.name?.message)}
                            helperText={t(`${errors?.name?.message}`)}
                            label={t('User name')}
                        />
                        <MyInput
                            {...register("username")}
                            error={Boolean(errors?.username?.message)}
                            helperText={t(`${errors?.username?.message}`)}
                            label={t('User address')}
                        />
                        <MyInput
                            {...register("currentPassword")}
                            error={Boolean(errors?.currentPassword?.message)}
                            helperText={t(`${errors?.currentPassword?.message}`)}
                            label={t('User current password')}
                            type={showPassword ? 'text' : 'password'}
                            endIcon={
                                <div
                                    className={'cursor-pointer text-gray-400'}
                                    onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            }
                        />
                        <MyInput
                            {...register("newPassword")}
                            error={Boolean(errors?.newPassword?.message)}
                            helperText={t(`${errors?.newPassword?.message}`)}
                            label={t('User new password')}
                            type={newShowPassword ? 'text' : 'password'}
                            endIcon={
                                <div
                                    className={'cursor-pointer text-gray-400'}
                                    onClick={() => setNewShowPassword(!newShowPassword)}>
                                    {newShowPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </div>
                            }
                        />
                    </div>
                </div>
                <MyDivider />
                <MyButton
                    type='submit'
                    className={'mt-3'}
                    variant="primary">{t("Add & Save")}</MyButton>
            </form>
        </>
    );
}

export default Form;
