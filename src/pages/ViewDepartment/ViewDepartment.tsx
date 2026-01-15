import MyBreadCrumb from "components/Atoms/MyBreadCrumb";
import MyButton from "components/Atoms/MyButton/MyButton";
import MyDivider from "components/Atoms/MyDivider";
import PageContentWrapper from "components/Layouts/PageContentWrapper";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import MainContent from "./_components/MainContent";
import Sidebar from "./_components/Sidebar/Sidebar";
import { paramsStrToObj } from "utils/helper";
import { SidebarMenuType } from 'types/sidebar';
import { searchValue } from "types/search";


const ViewPage = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const paramsValue: searchValue = paramsStrToObj(location?.search)

    const breadCrumbs = [
        {
            label: t('View Department'),
            url: '#'
        }
    ];

    const currentSetting = searchParams.get("current-setting");

    const isValidSubDepartmentSetting =
        paramsValue.subdepartmentId &&
        (
            currentSetting === "subdepartmentInfo" ||
            currentSetting === "sub_employee_list"
        );

    // const isValidDepartmentSetting = paramsValue?.parentDepartmentId && (
    //     currentSetting === "departmentInfo" || currentSetting === "subdepartment" || currentSetting === "employee_list"
    // )


    const sidebar_menu: SidebarMenuType[] = [
        {
            title: t('Organization info'),
            items: [
                {
                    icon: 'User',
                    name: t('Department lists'),
                    path: 'department',
                    isSwitch: false
                },
            ]
        },
        ...(paramsValue?.parentDepartmentId ? [
            {
                title: t('Department info'),
                items: [
                    {
                        icon: 'User',
                        name: t('Department details'),
                        path: 'departmentInfo',
                        isSwitch: false
                    },
                    {
                        icon: 'User',
                        name: t('SubDepartment list'),
                        path: 'subdepartment',
                        isSwitch: false
                    },
                    {
                        icon: 'CarTaxiFront',
                        name: t('Employee list'),
                        path: 'employee_list',
                        isSwitch: false
                    },
                ]
            }
        ]
            : []),
        ...(isValidSubDepartmentSetting ? [
            {
                title: t('SubDepartment info'),
                items: [
                    {
                        icon: 'User',
                        name: t('SubDepartment details'),
                        path: 'subdepartmentInfo',
                        isSwitch: false
                    },
                    {
                        icon: 'CarTaxiFront',
                        name: t('Employee list'),
                        path: 'sub_employee_list',
                        isSwitch: false
                    },
                ]
            }
        ] : [])
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
                <Sidebar sidebar_menu={sidebar_menu} sidebar_menu_type="simple" />
                <MainContent />
            </div>
        </PageContentWrapper>
    );
}

export default ViewPage;