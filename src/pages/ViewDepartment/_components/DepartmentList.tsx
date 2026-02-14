import Loading from "assets/icons/Loading";
import ConfirmationModal from "components/Atoms/Confirmation/Modal";
import MyModal from "components/Atoms/MyModal";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { useDeleteQuery, useGetAllQuery } from "hooks/api";
import { get } from "lodash";
import DepartmentCard from "pages/DepartmentsPage/_components/DepartmentCard";
import EditForm from "pages/DepartmentsPage/_components/EditForm";
import { Department } from "pages/DepartmentsPage/interface/department.interface";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useSearchParams } from "react-router-dom";
import { searchValue } from "types/search";
import { paramsStrToObj } from "utils/helper";


const DepartmentList = () => {
    const { t } = useTranslation()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const [show, setShow] = useState(false)
    const [open, setOpen] = useState(false)
    const [editId, setEditId] = useState(null)
    const [departmentId, setDepartmentId] = useState(null)
    const paramsValue: searchValue = paramsStrToObj(location?.search)
    const { data, isLoading, refetch } = useGetAllQuery<{ data: Department[] }>({
        key: KEYS.getAllListDepartment,
        url: URLS.getAllListDepartment,
        params: {
            organizationId: Number(paramsValue?.organizationId),
            parentId: searchParams.get("current-setting") !== "department" ? Number(paramsValue.parentDepartmentId) : null
        }
    })

    const { mutate: deleteRequest } = useDeleteQuery({
        listKeyId: KEYS.getAllListDepartment
    });


    const deleteItem = () => {
        deleteRequest(
            {
                url: `${URLS.getAllListDepartment}/${departmentId}`
            },
            {
                onSuccess: () => {
                    refetch();
                    setOpen(false)
                }
            }
        );
    };

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loading />
            </div>
        );
    }
    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'>
                {
                    get(data, 'data')?.map((item: Department) => (
                        <DepartmentCard
                            setShow={setShow}
                            setEditId={setEditId}
                            setDepartmentId={setDepartmentId}
                            setOpen={setOpen}
                            key={item?.id} item={item} />
                    ))
                }
            </div>

            <MyModal
                modalProps={{
                    show: Boolean(show),
                    onClose: () => {
                        setShow(false)
                    }
                }}
                headerProps={{
                    children: <h2 className="text-xl font-semibold">{t('Edit department')}</h2>,
                    className: 'px-6'
                }}
                bodyProps={{
                    children: <EditForm setShow={setShow} editId={editId} refetch={refetch} />
                }}
            />

            <ConfirmationModal
                title={t("Bu tashkilotni o'chirmoqchimisiz?")}
                subTitle={t("Bu amalni qaytarib bo'lmaydi!")}
                open={open} setOpen={setOpen} confirmationDelete={deleteItem} />
        </>
    );
}

export default DepartmentList;
