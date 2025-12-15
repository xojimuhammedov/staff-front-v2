import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyButton from 'components/Atoms/MyButton/MyButton';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { ArrowLeft, Calendar, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import ActionList from './_components/ActionList';
import { useForm } from 'react-hook-form';
import { useSearch } from 'hooks/useSearch';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { MyInput } from 'components/Atoms/Form';
import { KeyTypeEnum } from 'enums/key-type.enum';

const AttendancesActions = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { control, watch }: any = useForm()
    const { search, setSearch, handleSearch } = useSearch();
    const breadCrumbs = [
        {
            label: t('Attendance action list'),
            url: '#'
        }
    ];
    return (
        <PageContentWrapper>
            <div className='flex justify-between items-center'>
                <div className="flex flex-col">
                    <h1 className="headers-core dark:text-text-title-dark text-text-base">
                        {t('Attendances')}
                    </h1>
                    <MyBreadCrumb items={breadCrumbs} />
                </div>
                <div className='flex items-center gap-4'>
                    <MyInput
                        onKeyUp={(event) => {
                            if (event.key === KeyTypeEnum.enter) {
                                handleSearch();
                            } else {
                                setSearch((event.target as HTMLInputElement).value);
                            }
                        }}
                        defaultValue={search}
                        startIcon={<Search className="stroke-text-muted" onClick={handleSearch} />}
                        className="dark:bg-bg-input-dark"
                        placeholder={t('Search...')}
                    />
                    <MyTailwindPicker
                        useRange={true}
                        name='date'
                        asSingle={false}
                        control={control}
                        placeholder={t('Today')}
                        startIcon={<Calendar stroke="#9096A1" />}
                    />
                    <div>
                        <MyButton
                            onClick={() => navigate('/attendances')}
                            className={'w-[220px]'}
                            variant="secondary"
                            startIcon={<ArrowLeft />}>
                            {t('Back to attendances list')}
                        </MyButton>
                    </div>
                </div>
            </div>
            <ActionList watch={watch} />
        </PageContentWrapper>
    );
}

export default AttendancesActions;
