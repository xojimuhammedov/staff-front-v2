import { forwardRef, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import { MyCheckbox, MyInput } from '../Form';
import MyPagination from '../MyPagination';
import DataGridCell from './DataGridCell';
import FirstCapitalLetter from '../FirstCapitalLetter';
import SocialCell from './SocialCell';
import ExportButton from './ExportButton';
import MyDivider from '../MyDivider';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useTableContext from 'providers/TableProvider/useTableContext';
import ActionSelectButton from './ActionSelectButton';
import FiltersButton from './Filters';
import { get, isEmpty } from 'lodash';
import { IPagination } from '../../../interfaces/pagination.interface';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../constants/pagination.constants';
import { DataGridColumnType } from './DataGridCell.types';
import { useLocation, useSearchParams } from 'react-router-dom';
import { KeyTypeEnum } from '../../../enums/key-type.enum';
import { IAction } from '../../../interfaces/action.interface';
import RowActions from './RowActions';
import { paramsStrToObj } from 'utils/helper';
import NoData from 'assets/icons/NoData';

interface DataGridProps<TItem = any> {
  hasOrderColumn?: boolean;
  hasCheckbox?: boolean;
  hasCustomizeColumns?: boolean;
  dataColumn?: any[];
  hasExport?: boolean;
  hasAction?: boolean;
  hasFilters?: boolean;
  hasPagination?: boolean;
  hasSearch?: boolean;
  pagination?: IPagination | any;
  actions?: IAction[];
  rowActions?: IAction[];
  isLoading?: boolean;
  hasButton?: any;
  hasDatePicker?: any;
  handleRowClick?: (row: TItem) => void;
  rowClassName?: string | string[];
}

type DivRef = React.ComponentPropsWithRef<'div'>['ref'];

/**
 * Renders a data grid with optional features like ordering, checkboxes, column customization, export, and search.
 * It integrates with a table context provider for data and configuration.
 *
 * @param {DataGridProps} props - Configuration options for the grid.
 * @param {boolean} [props.hasOrderColumn=true] - Shows an order column.
 * @param {boolean} [props.hasCheckbox=true] - Includes row selection checkboxes.
 * @param {boolean} [props.hasCustomizeColumns=true] - Enables column customization.
 * @param {boolean} [props.hasExport=true] - Adds export functionality.
 * @param {boolean} [props.hasPagination=true] - Adds pagination functionality.
 * @param {boolean} [props.hasAction=false] - Adds action functionality.
 * @param {boolean} [props.hasFilters=false] - Adds filters functionality.
 * @param {boolean} [props.hasSearch=true] - Incorporates a search feature.
 * @param {func}    [props.handleRowClick] - handle row click event
 * @param {string} [props.rowClassName] - external styles for data grid rows
 * @param {React.RefObject<HTMLDivElement>} ref - Ref to the grid's container.
 * @returns {React.ReactElement} - The rendered data grid component.
 */

const DataGrid = forwardRef(
  ({
    hasOrderColumn = true,
    hasCheckbox = true,
    hasCustomizeColumns = true,
    hasExport = true,
    hasPagination = true,
    hasAction = false,
    hasFilters = false,
    dataColumn = [],
    hasSearch = true,
    isLoading = false,
    actions = [],
    rowActions = [],
    hasButton,
    hasDatePicker,
    pagination = {
      page: DEFAULT_PAGE,
      limit: DEFAULT_LIMIT,
      total: 0
    },
    handleRowClick,
    rowClassName
  }: DataGridProps) => {
    const { t } = useTranslation();
    const location = useLocation();
    const searchValue: any = paramsStrToObj(location?.search);
    const { columns, columnHash, rows, keyExtractor, filter } = useTableContext();
    const ref = useRef<HTMLDivElement>(null);
    const [element, setElement] = useState<DivRef>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState<string>('');
    const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);
    const [allSelected, setAllSelected] = useState(false);

    const headerCellGeneralStyle =
      'px-[16px] py-[14px] text-left dark:text-text-title-dark sm:text-xs lg:text-sm font-normal text-c-m text-text-base';

    useEffect(() => {
      if (!ref) {
        return;
      }

      setElement(ref);
    }, []);

    useEffect(() => {
      setAllSelected(isAllSelected());
    }, [JSON.stringify(rows), JSON.stringify(selectedItems)]);

    const el = document.getElementById('table-container');

    const handleBodyClick = (e: any) => {
      let clickedElement = e.target;

      while (clickedElement && !clickedElement.hasAttribute('data-index')) {
        clickedElement = clickedElement.parentNode;
      }

      const index = clickedElement.getAttribute('data-index');

      if (index && handleRowClick) {
        handleRowClick(rows[Number(index)]);
      }
    };

    const handleSearch = () => {
      if (search) {
        searchParams.set('search', search);
        searchParams.set('page', '1');
      } else {
        searchParams.delete('search');
      }
      setSearchParams(searchParams);
    };

    const handleSelectAll = ($e: any) => {
      if (rows instanceof Array) {
        let tmpSelectedItems = [...selectedItems];
        const rowIds = rows.map((row) => get(row, 'id', get(row, '_id')));
        if (get($e, 'target.checked')) {
          rowIds.forEach((id) => {
            if (!tmpSelectedItems.includes(id)) {
              tmpSelectedItems.push(id);
            }
          });
        } else {
          tmpSelectedItems = tmpSelectedItems.filter((id) => !rowIds.includes(id));
        }
        setSelectedItems(tmpSelectedItems);
      }
    };

    const handleSelectOne = (item: any) => {
      let tmpSelectedItems = [...selectedItems];
      const itemId = get(item, 'id', get(item, '_id'));
      if (!tmpSelectedItems.includes(itemId)) {
        tmpSelectedItems.push(itemId);
      } else {
        tmpSelectedItems = tmpSelectedItems.filter((id) => id !== itemId);
      }
      setSelectedItems(tmpSelectedItems);
    };

    const isAllSelected = () => {
      if (rows instanceof Array && !isEmpty(rows)) {
        const rowIds = rows.map((row) => get(row, 'id', get(row, '_id')));
        for (let id of rowIds) {
          if (!selectedItems.includes(id)) {
            return false;
          }
        }
        return true;
      }
      return false;
    };

    return (
      <>
        {(hasSearch || hasCustomizeColumns || hasExport || hasAction || hasFilters) && (
          <>
            <div className="flex flex-row justify-between ">
              {hasSearch && (
                <MyInput
                  onKeyUp={(event) => {
                    if (event.key === KeyTypeEnum.enter) {
                      handleSearch();
                    } else {
                      setSearch(get(event, 'target.value', ''));
                    }
                  }}
                  startIcon={<Search className="stroke-text-muted" onClick={handleSearch} />}
                  className="w-[300px] dark:bg-bg-input-dark"
                  placeholder={t('Search...')}
                  defaultValue={get(searchValue, 'search')}
                />
              )}
              <div className="flex flex-row items-center gap-4">
                {hasAction && <ActionSelectButton actions={actions} items={selectedItems} />}
                {hasDatePicker}
                {/* {hasCustomizeColumns && <CustomizeColumnsButton />} */}
                {hasFilters && <FiltersButton filters={filter} />}
                {hasExport && <ExportButton />}
                {hasButton}
              </div>
            </div>
            <MyDivider />
          </>
        )}
        {!isLoading ? (
          <>
            <div ref={ref}>
              <div className="grid-header item-center flex border-b border-border-base dark:border-dark-line dark:bg-bg-darkBg">
                {hasCheckbox && (
                  <div
                    className={twMerge(
                      headerCellGeneralStyle,
                      'flex h-12  w-12 flex-none items-center justify-center bg-bg-subtle px-[16px] py-[14px] dark:bg-bg-darkBg'
                    )}>
                    <MyCheckbox checked={allSelected} onChange={handleSelectAll} />
                  </div>
                )}
                {hasOrderColumn && (
                  <div
                    className={twMerge(
                      headerCellGeneralStyle,
                      'flex h-12 w-12 flex-none items-center justify-center bg-bg-subtle px-[16px] py-[14px] dark:bg-bg-darkBg dark:text-text-title-dark'
                    )}>
                    #
                  </div>
                )}

                {dataColumn.map((column: any, i: number) => {
                  // if (!columnHash[column.key].visible) {
                  //   return null;
                  // }

                  return (
                    <div
                      key={i}
                      className={twMerge(
                        headerCellGeneralStyle,
                        'bg-bg-subtle dark:bg-bg-darkBg dark:text-text-title-dark',
                        column.align === 'right' && 'text-right',
                        column.align === 'center' && 'text-center',
                        column.headerClassName || 'w-52 dark:text-text-title-dark'
                      )}>
                      {column.label}
                    </div>
                  );
                })}

                {!isEmpty(rowActions) && (
                  <div
                    className={twMerge(
                      headerCellGeneralStyle,
                      'bg-bg-subtle dark:bg-bg-darkBg dark:text-text-title-dark',
                      'text-right',
                      'w-24'
                    )}>
                    {t('Actions')}
                  </div>
                )}
              </div>
              <div className="grid-body w-full" onClick={handleBodyClick}>
                {rows?.length > 0 ? (
                  <>
                    {rows?.map((row: any[], i: number) => {
                      return (
                        <div
                          key={i}
                          data-row
                          data-index={i}
                          data-id={get(row, keyExtractor)}
                          className={twMerge([
                            'data-grid-row  flex items-center odd:bg-bg-subtle dark:odd:bg-[#1B1B1F]',
                            rowClassName
                          ])}>
                          {hasCheckbox && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className={twMerge(
                                headerCellGeneralStyle,
                                'flex h-12 w-12 flex-none items-center justify-center px-[16px] py-[14px] text-text-base'
                              )}>
                              <MyCheckbox
                                checked={selectedItems.includes(
                                  get(row, 'id', get(row, '_id', ''))
                                )}
                                onChange={($e) => handleSelectOne(row)}
                              />
                            </div>
                          )}
                          {hasOrderColumn && (
                            <div
                              className={twMerge(
                                headerCellGeneralStyle,
                                'flex h-12 w-12 flex-none items-center justify-center px-[16px] py-[14px] text-text-base'
                              )}>
                              {/* {i + 1} */}
                              {pagination?.page * pagination?.total + i + 1 - pagination?.total}
                            </div>
                          )}
                          {columns.map((column: DataGridColumnType, j: number) => {
                            if (!columnHash[column.key].visible) {
                              return null;
                            }

                            const {
                              cellRender,
                              className,
                              headerClassName,
                              align,
                              type,
                              visible,
                              truncated
                            } = columnHash[column.key];
                            if (!visible) {
                              return null;
                            }
                            const externalClassName = `${className || ''} ${headerClassName || 'w-52 dark:text-text-title-dark'}`;

                            if (cellRender) {
                              return (
                                <DataGridCell key={`${i}-${j}`} className={externalClassName}>
                                  {cellRender(row)}
                                </DataGridCell>
                              );
                            }
                            switch (type) {
                              case 'link':
                                return (
                                  <DataGridCell key={`${i}-${j}`} className={externalClassName}>
                                    <a className="text-text-link " href="">
                                      {get(row, column.key, '')}
                                    </a>
                                  </DataGridCell>
                                );
                              case 'first-capital-letter':
                                return (
                                  <DataGridCell
                                    key={`${i}-${j}`}
                                    className={`relative flex w-full items-center pl-10 dark:text-text-title-dark  ${externalClassName}`}>
                                    <FirstCapitalLetter
                                      className="absolute left-0"
                                      name={get(row, column.key, '')}
                                    />
                                    <p>{get(row, column.key, '')}</p>
                                  </DataGridCell>
                                );
                              case 'social':
                                return (
                                  <DataGridCell key={`${i}-${j}`} className={externalClassName}>
                                    <SocialCell title={get(row, column.key, '')} />
                                  </DataGridCell>
                                );
                              default:
                                return (
                                  <DataGridCell
                                    key={`${i}-${j}`}
                                    align={align}
                                    className={externalClassName}>
                                    {!truncated ? (
                                      get(row, column.key, '')
                                    ) : (
                                      <p
                                        className={twMerge([
                                          'line-clamp-1 overflow-hidden overflow-ellipsis break-all dark:text-text-title-dark '
                                        ])}>
                                        {get(row, column.key, '')}
                                      </p>
                                    )}
                                  </DataGridCell>
                                );
                            }
                          })}

                          {!isEmpty(rowActions) && (
                            <div className={twMerge(headerCellGeneralStyle, 'text-right ', 'w-24')}>
                              <RowActions actions={rowActions} row={row} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="mt-8 flex flex-col items-center">
                    <NoData />
                    <p className="mt-2 text-c-s-p text-tag-neutral-text dark:text-subtext-color-dark">
                      {t('No Data')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* @ts-ignore */}
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
        ) : (
          <></>
        )}
      </>
    );
  }
);

export default DataGrid;
