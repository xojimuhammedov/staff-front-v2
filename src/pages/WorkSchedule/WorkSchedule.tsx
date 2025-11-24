import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import WorkScheduleList from './WorkScheduleListPage/_components/SchedulList';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MyInput } from 'components/Atoms/Form';
import { KeyTypeEnum } from 'enums/key-type.enum';
import { useSearch } from 'hooks/useSearch';

const WorkSchedule = () => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const { search, setSearch, handleSearch } = useSearch();
    const breadCrumbs = [
        {
            label: t('Work schedule'),
            url: '#'
        }
    ];
    return (
        <PageContentWrapper>
            <div className='flex items-center justify-between'>
                <div className="flex flex-col">
                    <h1 className="headers-core dark:text-text-title-dark text-text-base">
                        {t('Work schedule')}
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
                    <div className='flex items-center'>
                        <MyButton
                            onClick={() => navigate('/workschedule/create')}
                            startIcon={<Plus />}
                            allowedRoles={['ADMIN', 'HR']}
                            variant="primary"
                            className="[&_svg]:stroke-bg-white w-[180px] text-sm">
                            {t('Create a schedule')}
                        </MyButton>
                    </div>
                </div>
            </div>
            <WorkScheduleList />
        </PageContentWrapper>
    );
}

export default WorkSchedule;
