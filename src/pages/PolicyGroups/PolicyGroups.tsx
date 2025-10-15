import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import GroupTable from './_components/GroupTable';

const PolicyGroups = () => {
    const { t } = useTranslation();
    const breadCrumbs = [
        {
            label: t('Policy Groups'),
            url: '#'
        }
    ];
    return (
        <PageContentWrapper>
            <div className="flex flex-col">
                <h1 className="headers-core dark:text-text-title-dark text-text-base">
                    {t('Policy groups')}
                </h1>
                <MyBreadCrumb items={breadCrumbs} />
            </div>
            <MyDivider />
            <GroupTable />
        </PageContentWrapper>
    );
}

export default PolicyGroups;
