import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MoreHorizontalIcon } from "lucide-react"
import NoData from "@/assets/icons/NoData"
import { useTranslation } from "react-i18next"
import { IPagination } from "@/interfaces/pagination.interface"
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constants/pagination.constants"
import MyPagination from "../MyPagination/Pagination"
import { IAction } from "@/interfaces/action.interface"
import RowActions from "./RowActions"
import { createPortal } from "react-dom"


// Ustunlar uchun Typelar
export interface DataGridColumnType<T = any> {
    key: string;
    label: string;
    headerClassName?: string;
    cellClassName?: string;
    cellRender?: (row: T) => React.ReactNode;
}

// Table uchun Propslar
interface DynamicTableProps<T> {
    data: T[];
    columns: DataGridColumnType<T>[];
    actionsRender?: (row: T) => React.ReactNode;
    hasPagination?: boolean;
    rowActions?: IAction[];
    pagination?: IPagination | any;
    hasIndex?: boolean;
}

type DivRef = React.ComponentPropsWithRef<'div'>['ref'];

export function DynamicTable<T>({ data, columns, actionsRender, rowActions, hasIndex = false, hasPagination = true, pagination = {
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    total: 0
}, }: DynamicTableProps<T>) {
    const { t } = useTranslation()
    const ref = useRef<HTMLDivElement>(null);
    const [element, setElement] = useState<DivRef>(null);

    useEffect(() => {
        if (!ref) {
            return;
        }

        setElement(ref);
    }, []);
    const el = document.getElementById('table-container');
    return (
        <>
            <div ref={ref} className="mt-8">
                <Table wrapperClassName="h-[calc(100vh-280px)]" className="w-full min-w-[800px] text-sm table-fixed">
                    <TableHeader className="sticky top-0 z-20 bg-white dark:bg-[rgb(var(--color-bg-bgblack-dark))]">
                        <TableRow className="border-b border-border-base dark:border-[rgb(var(--color-dark-line))]">
                            {hasIndex && (
                                <TableHead className="w-[50px] whitespace-nowrap text-center dark:text-text-title-dark">#</TableHead>
                            )}
                            {columns.map((col) => (
                                <TableHead
                                    key={col.key}
                                    className={`whitespace-nowrap ${col.headerClassName || ''}`}
                                >
                                    {col.label}
                                </TableHead>
                            ))}
                            {/* Actions ustuni kengayib ketmasligi uchun qat'iy w-[80px] berilgan */}
                            {rowActions && rowActions.length > 0 && (
                                <TableHead className="w-[80px] text-right whitespace-nowrap dark:text-text-title-dark">
                                    {t("Actions")}
                                </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data && data?.length > 0 ? (
                            data?.map((row, rowIndex) => (
                                <TableRow className="border-b border-border-base dark:border-[rgb(var(--color-dark-line))]" key={(row as any)?.id || rowIndex}>
                                    {hasIndex && (
                                        <TableCell className="whitespace-nowrap text-center dark:text-text-title-dark">
                                            {(pagination?.page ? (pagination.page - 1) * (pagination.limit || 10) : 0) + rowIndex + 1}
                                        </TableCell>
                                    )}
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.key}
                                            // Matn sig'masa 3 ta nuqta (...) bilan qisqarishi uchun truncate qo'shishingiz ham mumkin:
                                            className={`whitespace-nowrap truncate ${col.cellClassName || ''}`}
                                        >
                                            {col.cellRender ? col.cellRender(row) : (row as any)[col.key]}
                                        </TableCell>
                                    ))}

                                    {rowActions && rowActions.length > 0 && (
                                        <TableCell className={'text-right z-[99999999]'}>
                                            <RowActions actions={rowActions} row={row} />
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (actionsRender ? 1 : 0)}
                                    className="h-48 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        <NoData />
                                        <p className="mt-2 text-c-s-p text-tag-neutral-text dark:text-subtext-color-dark">
                                            {t('No Data')}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {hasPagination && (
                <>
                    {element &&
                        createPortal(
                            <MyPagination className={['mt-6 ']} total={pagination?.total} />,
                            // @ts-ignore
                            el as unknown as Element
                        )}
                </>
            )}
        </>
    )
}