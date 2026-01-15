import Loading from "assets/icons/Loading";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { useGetAllQuery } from "hooks/api";
import { get } from "lodash";
import DepartmentCard from "pages/DepartmentsPage/_components/DepartmentCard";
import { Department } from "pages/DepartmentsPage/interface/department.interface";
import { useLocation, useSearchParams } from "react-router-dom";
import { searchValue } from "types/search";
import { paramsStrToObj } from "utils/helper";


const DepartmentList = () => {
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const paramsValue: searchValue = paramsStrToObj(location?.search)
    const { data, isLoading } = useGetAllQuery<{ data: Department[] }>({
        key: KEYS.getAllListDepartment,
        url: URLS.getAllListDepartment,
        params: {
            organizationId: Number(paramsValue?.organizationId),
            parentId: searchParams.get("current-setting") !== "department" ? Number(paramsValue.parentDepartmentId) : null
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
