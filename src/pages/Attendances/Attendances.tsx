import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import AttendanceList from './_components/AttendanceList';

const Attendances = () => {
    const { t } = useTranslation();
    const breadCrumbs = [
        {
            label: t('Attendances'),
            url: '#'
        }
    ];
    return (
        <PageContentWrapper>
            <div className="flex flex-col">
                <h1 className="headers-core dark:text-text-title-dark text-text-base">
                    {t('Attendances')}
                </h1>
                <MyBreadCrumb items={breadCrumbs} />
            </div>
            <MyDivider />
            <AttendanceList />
        </PageContentWrapper>
    );
}

export default Attendances;
