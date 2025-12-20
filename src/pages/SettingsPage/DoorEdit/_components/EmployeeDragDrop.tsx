import { MyCheckbox, MyInput, MySelect } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import MyDivider from "components/Atoms/MyDivider";
import LabelledCaption from "components/Molecules/LabelledCaption";
import config from "configs";
import { get } from "lodash";
import { Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import AvatarIcon from "assets/icons/avatar.png";
import MyAvatar from "components/Atoms/MyAvatar";
import { KeyTypeEnum } from "enums/key-type.enum";
import { useGetAllQuery, useGetOneQuery, usePostQuery } from "hooks/api";
import { URLS } from "constants/url";
import { KEYS } from "constants/key";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

interface EmployeeResponse {
  data: Employee[];
  limit: number;
  page: number;
  total: number;
}

interface Employee {
  id: number;
  name: string;
  additionalDetails: string;
  photo: string;
}

function EmployeeDragDrop() {
  const { t } = useTranslation();
  const { id } = useParams()
  const navigate = useNavigate()
  const [search, setSearch] = useState<any>("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [finalSelectedIds, setFinalSelectedIds] = useState<number[]>([]); // yakuniy tanlanganlar
  const [selectGates, setSelectGates] = useState<number[]>([]);

  const { mutate: create } = usePostQuery({
    listKeyId: KEYS.devicesEmployeeAssign,
    hideSuccessToast: true
  });

  const { data: employeeList } = useGetAllQuery<EmployeeResponse>({
    key: KEYS.getEmployeeList,
    url: URLS.getEmployeeList,
    params: {
      // search: searchParams.get("search"),
      limit: 100,
    }
  });

  const { data } = useGetOneQuery({
    id: id,
    url: URLS.getDoorGates,
    params: {},
    enabled: !!id
  })

  const { data: getDoor }: any = useGetAllQuery({
    key: KEYS.getDoorGates,
    url: URLS.getDoorGates,
    params: {}
  });

  const { handleSubmit } = useForm()

  const handleSearch = () => {
    if (search) {
      searchParams.set("search", search);
    } else {
      searchParams.delete("search");
    }
    setSearchParams(searchParams);
  };

  useEffect(() => {
    if (!data?.data?.employees || !Array.isArray(data?.data?.employees)) return;

    const newIds = data?.data?.employees
      ?.map((emp: any) => emp.id)
      .filter((id: number | null | undefined) => typeof id === 'number');

    if (newIds.length > 0) {
      setFinalSelectedIds(prev => Array.from(new Set([...prev, ...newIds])));
    }
  }, [data?.data?.employees]);

  const handleSelectAll = () => {
    if (selectedIds.length === (data?.data?.length ?? 0)) {
      setSelectedIds([]);
    } else {
      const ids = data?.data?.map((emp: any) => emp.id) ?? [];
      setSelectedIds(ids);
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  const handleAddSelected = () => {
    setFinalSelectedIds((prev) => {
      const merged = Array.from(new Set([...prev, ...selectedIds]));
      return merged;
    });
    setSelectedIds([]);
  };

  const handleRemoveFinal = (id: number) => {
    setFinalSelectedIds((prev) => prev.filter((empId) => empId !== id));
  };

  const finalEmployees =
    employeeList?.data?.filter((emp: Employee) => finalSelectedIds.includes(emp.id)) ?? [];
  const notSelectedEmployees =
    employeeList?.data?.filter((emp: Employee) => !finalSelectedIds.includes(emp.id)) ?? [];

  const options = useMemo(() =>
    getDoor?.data?.map((item: any) => ({
      label: item.name,
      value: item.id,
    })) || [],
    [getDoor?.data]);

  const selectedValues = useMemo(() =>
    options.filter((option: any) => selectGates.includes(option.value)),
    [options, selectGates]
  );

  const onSubmit = () => {
    const submitData = {
      employeeIds: finalSelectedIds,
      gateIds: [Number(id)],
      organizationId: get(data, 'data.organizationId')
    }
    create(
      {
        url: URLS.devicesEmployeeAssign,
        attributes: submitData
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully created!'));
          navigate('/settings')
        },
        onError: (e: any) => {
          toast.error(e?.response?.data?.error?.message)
        }
      }
    );
  };

  return (
    <div
      className={
        "mt-12 min-h-[400px] w-full rounded-m bg-bg-base p-4 shadow-base dark:bg-bg-dark-theme"
      }
    >
      <div className="mb-12 flex w-full items-start justify-between">
        <LabelledCaption
          className="flex-1"
          title={t('Gates')}
          subtitle={t('')}
        />
        <div className='w-[462px]'>
          <MySelect
            isMulti
            options={options}
            value={selectedValues}
            onChange={(selected: any) => {
              const ids = selected ? selected.map((s: any) => s.value) : [];
              setSelectGates(ids);
            }}
            allowedRoles={["ADMIN"]}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <LabelledCaption
            title={t("Add employees")}
            subtitle={t("Create employees group and link to the door")}
          />
        </div>
        <MyButton type="submit" onClick={handleSubmit(onSubmit)} variant="secondary">
          {t("Save changes")}
        </MyButton>
      </div>

      <MyDivider />
      <div className="mt-6 flex w-full gap-4">
        <div className="h-[600px] w-1/2 overflow-y-auto dark:border-dark-line rounded-md border-2 border-solid border-gray-300 p-4">
          <div>
            <MyInput
              onKeyUp={(event) => {
                if (event.key === KeyTypeEnum.enter) {
                  handleSearch();
                } else {
                  setSearch((event.target as HTMLInputElement).value);
                }
              }}
              defaultValue={searchParams.get("search") ?? ""}
              startIcon={
                <Search className="stroke-text-muted" onClick={handleSearch} />
              }
              placeholder={t("Search")}
            />
          </div>
          <div className="mt-4 flex w-full flex-col gap-4">
            <div className="lg:mx-4 sm:mx-1 flex items-center justify-between">
              <MyCheckbox
                label={t('Employees')}
                // checked={selectedIds?.length === data?.data?.length}
                onChange={handleSelectAll}
                id={(Math.random() * 10).toString()}
              />
              <MyButton
                onClick={handleAddSelected}
                disabled={selectedIds.length > 0 ? false : true}
                className={'font-medium sm:px-[2px] sm:text-xs lg:px-2 lg:text-sm'}
                variant="secondary">
                {t('Add selected employees')}
              </MyButton>
            </div>
            <div className="flex flex-col gap-3">
              {notSelectedEmployees?.map((emp: Employee) => (
                <div
                  key={emp?.id}
                  className="flex items-center p-4 border rounded-sm bg-white hover:bg-gray-50 transition"
                >
                  <MyCheckbox
                    className="w-4 h-4 accent-black mr-3"
                    checked={selectedIds.includes(emp?.id)}
                    onChange={() => handleCheckboxChange(emp?.id)}
                    label={emp?.name}
                    id={emp?.id.toString()}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex h-[600px] dark:border-dark-line w-1/2 flex-col gap-8 overflow-y-auto rounded-md border-2 border-solid border-gray-300 p-4 ">
          {finalEmployees?.map((evt: any, index: number) => (
            <div className="flex w-full items-center justify-between gap-4 pb-4 dark:border-dark-line border-b-2 bg-white dark:bg-bg-dark-bg">
              <div className="flex items-center gap-3" key={index} id={evt.id}>
                <MyAvatar
                  imageUrl={
                    evt.photo
                      ? `${config.FILE_URL}api/storage/${evt?.photo}`
                      : AvatarIcon
                  }
                  size="medium"
                />
                <div className="flex flex-col">
                  <h2 className="text-sm font-normal dark:text-text-title-dark text-black">
                    {evt?.name}
                  </h2>
                </div>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => handleRemoveFinal(evt.id)}
              >
                <Trash2 color="#9CA3AF" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmployeeDragDrop;

