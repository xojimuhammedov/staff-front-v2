import Loading from "assets/icons/Loading";
import MyBreadCrumb from "components/Atoms/MyBreadCrumb";
import MyButton from "components/Atoms/MyButton/MyButton";
import MyDivider from "components/Atoms/MyDivider";
import PageContentWrapper from "components/Layouts/PageContentWrapper";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { useGetAllQuery } from "hooks/api";
import { get } from "lodash";
import { ArrowLeft } from "lucide-react";
import DepartmentCard from "pages/DepartmentsPage/_components/DepartmentCard";
import { Department } from "pages/DepartmentsPage/interface/department.interface";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainContent from "./_components/MainContent";
import Sidebar from "./_components/Sidebar/Sidebar";


const ViewPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const breadCrumbs = [
        {
            label: t('View Department'),
            url: '#'
        }
    ];
    return (
        <PageContentWrapper>
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="headers-core dark:text-text-title-dark text-text-base">{t('View Department')}</h1>
                    <MyBreadCrumb items={breadCrumbs} />
                </div>
                <MyButton
                    onClick={() => navigate('/department')}
                    variant="secondary"
                    startIcon={<ArrowLeft />}>
                    {t('Back to department list')}
                </MyButton>
            </div>
            <MyDivider />
            <div className="flex gap-6">
                <Sidebar sidebar_menu_type="simple" />
                <MainContent />
            </div>
        </PageContentWrapper>
    );
}

export default ViewPage;