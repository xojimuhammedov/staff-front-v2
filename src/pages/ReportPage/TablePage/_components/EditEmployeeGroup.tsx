import { MyCheckbox, MyInput } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import MyPagination from 'components/Atoms/MyPagination/Pagination';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { KeyTypeEnum } from 'enums/key-type.enum';
import { useGetAllQuery } from 'hooks/api';
import { get } from 'lodash';
import { Search } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router-dom';
import { searchValue } from 'types/search';
import { paramsStrToObj } from 'utils/helper';

type EditEmployeeGroupProps = {
    departmentId?: number;
    onSelectedIdsChange?: (ids: number[]) => void;
};

const EditEmployeeGroup = ({ departmentId, onSelectedIdsChange }: EditEmployeeGroupProps) => {

    const { t } = useTranslation()
    const [search, setSearch] = useState<any>("");
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const location = useLocation()
    const searchValue: searchValue = paramsStrToObj(location.search)
    const lastSentRef = useRef<string>("");

    const { data } = useGetAllQuery<any>({
        key: KEYS.getEmployeeList,
        url: URLS.getEmployeeList,
        params: {
            search: searchParams.get("search"),
            departmentId: departmentId,
            page: searchValue?.page || 1,
            limit: searchValue?.limit || 10,
        },
    });

    useEffect(() => {
        // ✅ faqat kerak bo‘lsa reset
        setSelectedIds((prev) => (prev.length ? [] : prev));

        // ✅ page bo‘lsa — o‘chirib, yangi instance qaytaramiz
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (!next.has("page")) return prev; // o‘zgarmasa navigatsiya bo‘lmasin
            next.delete("page");
            return next;
        }, { replace: true }); // ✅ history’ga spam qo‘shmaydi
    }, [departmentId, setSearchParams]);

    // Barcha IDlarni olish
    const allIds = data?.data?.map((item: any) => item?.id) || [];

    // Barchasini tanlash / bekor qilish
    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(allIds);
        } else {
            setSelectedIds([]);
        }
    };

    // Bitta checkbox o‘zgarganda
    const handleSelectOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds((prev) => [...prev, id]);
        } else {
            setSelectedIds((prev) => prev.filter((i) => i !== id));
        }
    };

    // Barchasi tanlanganligini aniqlash
    const isAllSelected =
        allIds.length > 0 && selectedIds.length === allIds.length;


    const handleSearch = () => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);

            if (search?.trim()) next.set("search", search.trim());
            else next.delete("search");

            next.delete("page");
            return next;
        }, { replace: true });
    };

    useEffect(() => {
        if (!onSelectedIdsChange) return;

        const sig = selectedIds?.join(","); // signature
        if (sig === lastSentRef.current) return;

        lastSentRef.current = sig;
        onSelectedIdsChange(selectedIds);
    }, [selectedIds, onSelectedIdsChange]);


    return (
        <>
            <div className='flex items-center justify-between'>
                <LabelledCaption
                    title={t('Add employees to group')}
                    subtitle={t('Short description describing this collection')}
                />
                <div className='flex items-center my-2'>
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
            </div>
            <div className='min-h-[63vh]'>
                <div className='border dark:border-dark-line p-4 mt-6 rounded-lg'>
                    <div className='grid grid-cols-3 w-full'>
                        <div className='flex items-center gap-2'>
                            <MyCheckbox checked={isAllSelected}
                                onChange={(checked) => handleSelectAll(checked)} label='Employee' />
                        </div>
                        <div className='dark:text-text-title-dark'>{t("Department")}</div>
                        <div className='dark:text-text-title-dark'>{t("Phone")}</div>
                    </div>
                    <MyDivider />
                    {
                        data?.data?.map((item: any) => (
                            <div key={item?.id} className='grid grid-cols-3 my-6 w-full'>
                                <div>
                                    <MyCheckbox
                                        label={item?.name}
                                        checked={selectedIds.includes(item?.id)}
                                        onChange={(checked) => handleSelectOne(item?.id, checked)} />
                                </div>
                                <div className='dark:text-text-title-dark'>{item?.department?.shortName}</div>
                                <div className='dark:text-text-title-dark'>{item?.phone}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <MyPagination total={get(data, 'total')} />
        </>
    );
}

export default EditEmployeeGroup;
