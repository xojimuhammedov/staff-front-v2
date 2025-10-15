import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import { useForm } from 'react-hook-form';
import { MyInput } from 'components/Atoms/Form';
import { useTranslation } from 'react-i18next';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import { toast } from 'react-toastify';

const LoginForm = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const schema = object().shape({
    username: string().required(t('username is required')),
    password: string().required(t('password is required'))
  });

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    defaultValues: { username: '', password: '' },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: any) => {
    const { username, password } = data;
    // const passwordRegex =
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

    // if (passwordRegex.test(password)) {
    //   setError('');
    //   auth.login({ identifier, password }, () => {
    //     toast.error(t('Username or password error!'));
    //   });
    // } else {
    //   setError(
    //     t("Parol kamida 8 ta belgi, katta va kichik harf, raqam va maxsus belgi bo'lishi kerak!")
    //   );
    // }
      auth.login({ username, password }, () => {
        toast.error(t('Username or password error!'));
      });
  };
  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <MyInput
          error={Boolean(errors?.username?.message)}
          helperText={errors?.username?.message}
          className="bg-bg-base"
          placeholder={t('username')}
          {...register('username')}
        />
      </div>
      <div className="mb-6">
        <MyInput
          error={Boolean(errors?.password?.message)}
          helperText={errors?.password?.message}
          className="bg-bg-base"
          placeholder={t('password')}
          {...register('password')}
          type={showPassword ? 'text' : 'password'}
          endIcon={
            <div
              className={'cursor-pointer text-gray-400'}
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          }
        />
        <p className="mt-2 text-red-500">{error}</p>
      </div>
      <MyButton
        type="submit"
        endIcon={auth.loading ? <ArrowRight width={20} height={20} /> : ''}
        className="dark-submit w-full dark:bg-btn-bg-dark dark:font-medium dark:leading-5 dark:text-bg-darkBg [&_svg]:stroke-bg-base"
        variant="primary">
        {auth.loading ? (
          t('Sign in')
        ) : (
          <div className="text-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </MyButton>
    </form>
  );
};

export default LoginForm;
