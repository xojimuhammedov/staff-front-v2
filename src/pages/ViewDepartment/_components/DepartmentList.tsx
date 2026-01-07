import Loading from "assets/icons/Loading";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { useGetAllQuery } from "hooks/api";
import { get } from "lodash";
import DepartmentCard from "pages/DepartmentsPage/_components/DepartmentCard";
import { Department } from "pages/DepartmentsPage/interface/department.interface";
import { useSearchParams } from "react-router-dom";


const DepartmentList = () => {
    const [paramsId] = useSearchParams()
    const organizationId = paramsId.get("organizationId")
    const departmentId = paramsId.get("subdepartmentId")
    const { data, isLoading } = useGetAllQuery<{ data: Department[] }>({
        key: KEYS.getAllListDepartment,
        url: URLS.getAllListDepartment,
        params: {
            organizationId: organizationId,
            parentId: departmentId
        }
    })

    if (isLoading) {
        return (
            <div className="absolute flex h-full w-full items-center justify-center">
                <Loading />
            </div>
        );
    }
    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'>
                {
                    get(data, 'data')?.map((item: Department) => (
                        <DepartmentCard key={item?.id} item={item} />
                    ))
                }
            </div>
        </>
    );
}

export default DepartmentList;
