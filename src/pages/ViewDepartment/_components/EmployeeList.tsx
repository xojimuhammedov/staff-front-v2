import EmployeeList from 'pages/EmployeePage/_components/EmployeeList';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { searchValue } from 'types/search';
import { paramsStrToObj } from 'utils/helper';


const EmployeeListDepartment = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const searchValue: searchValue = paramsStrToObj(location.search)
    return (
        <>
            <h2 className="headers-core dark:text-text-title-dark text-text-base">{t("Employee list")}</h2>
            <EmployeeList searchValue={searchValue} />
        </>
    );
}

export default EmployeeListDepartment;
