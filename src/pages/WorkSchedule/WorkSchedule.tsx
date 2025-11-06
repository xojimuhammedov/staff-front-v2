import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import WorkScheduleList from './WorkScheduleListPage/_components/SchedulList';

const WorkSchedule = () => {
    const { t } = useTranslation();
    const breadCrumbs = [
        {
            label: t('Work schedule'),
            url: '#'
        }
    ];
    return (
        <PageContentWrapper>
            <div className="flex flex-col">
                <h1 className="headers-core dark:text-text-title-dark text-text-base">
                    {t('Work schedule')}
                </h1>
                <MyBreadCrumb items={breadCrumbs} />
            </div>
            <MyDivider />
            <WorkScheduleList />
        </PageContentWrapper>
    );
}

export default WorkSchedule;
