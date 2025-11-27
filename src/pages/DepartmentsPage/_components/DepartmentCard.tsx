import { useTranslation } from 'react-i18next';
import { Edit, Eye, Mail, MapPin, NotebookPen, Phone, Trash2 } from 'lucide-react';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyBadge from 'components/Atoms/MyBadge';
import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const DepartmentCard = ({ item, setOpen, setDepartmentId, setShow }: any) => {
    const { t } = useTranslation()
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const handleViewClick = (item: any) => {
        const currentSetting = searchParams.get('current-setting');

        if (location?.pathname && currentSetting === 'subdepartment') {
            return navigate(`/view?subdepartmentId=${item?.id}&current-setting=employee_list`);
        }
        if (item?._count?.childrens) {
            return navigate(`/view?subdepartmentId=${item?.id}&current-setting=subdepartment`);
        } else {
            return navigate(`/employees?subdepartmentId=${item?.id}`);
        }
    };
    return (
        <div className='dark:bg-bg-dark-bg border border-gray-200 rounded-lg shadow-sm p-4 gap-2'>
            <div className='flex items-center justify-between'>
                <h3 className='text-xl font-inter font-medium dark:text-text-title-dark'>{item?.fullName}</h3>
                <MyBadge variant='green'>{t("Active")}</MyBadge>
            </div>
            <div className='grid grid-cols-2 gap-2 my-4'>
                <div className='rounded-lg bg-[#F9FAFB] dark:bg-bg-dark-theme p-3'>
                    <h5 className='text-sm dark:text-text-title-dark'>{t("Departments")}</h5>
                    <h3 className='text-2xl font-inter font-bold dark:text-text-title-dark'>{item?._count?.childrens}</h3>
                </div>
                <div className='rounded-lg bg-[#F9FAFB] dark:bg-bg-dark-theme p-3'>
                    <h5 className='text-sm dark:text-text-title-dark'>{t("Employees")}</h5>
                    <h3 className='text-2xl font-inter font-bold dark:text-text-title-dark'>{item?._count?.employees}</h3>
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <MapPin width={'16px'} />
                <p className='dark:text-text-title-dark'>{item?.address}</p>
            </div>
            <div className='flex items-center gap-2 mt-2'>
                <Phone width={'16px'} />
                <p className='dark:text-text-title-dark'>{item?.phone}</p>
            </div>
            <div className='flex items-center gap-2 mt-2'>
                <Mail width={'16px'} />
                <p className='dark:text-text-title-dark'>{item?.email}</p>
            </div>
            <div className='flex items-center gap-2 mt-2'>
                <NotebookPen width={'16px'} />
                <p className='dark:text-text-title-dark'>{item?.additionalDetails}</p>
            </div>
            <div className='flex items-center justify-between gap-4 mt-4'>
                <MyButton
                    variant="secondary"
                    allowedRoles={['ADMIN', 'HR']}
                    className="w-[170px]"
                    onClick={() => handleViewClick(item)}
                    startIcon={<Eye />}
                >
                    {t("View")}
                </MyButton>
                <MyButton
                    variant='secondary'
                    allowedRoles={['ADMIN', "HR"]}
                    className={'w-[170px]'}
                    onClick={() => {
                        setShow(true)
                        setDepartmentId(item?.id)
                    }}
                    startIcon={<Edit />}
                >{t("Edit")}</MyButton>
                <MyButton
                    allowedRoles={['ADMIN', "HR"]}
                    onClick={() => {
                        setOpen(true)
                        setDepartmentId(item?.id)
                    }}
                    className={'[&_svg]:stroke-bg-[#E11D48]'}
                    variant='secondary' startIcon={<Trash2 color='red' />}></MyButton>
            </div>
        </div>
    );
}

export default React.memo(DepartmentCard);