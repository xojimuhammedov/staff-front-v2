import { createContext, ReactNode } from 'react';
import useTableProvider from './useTableProvider';

export const TableContext = createContext<ReturnType<typeof useTableProvider>>({
  filter: {},
  columns: [],
  dispatch: () => {},
  rows: [],
  columnHash: {},
  keyExtractor: ''
});

type UseTableProviderArgsType<TItem, KFilter> = Parameters<typeof useTableProvider<TItem, KFilter>>;

interface TableProviderProps<TItem, KFilter> {
  children: ReactNode;
  values: UseTableProviderArgsType<TItem, KFilter>[0];
}

function TableProvider<TItem, KFilter extends Record<string, any>>({
  children,
  values
}: TableProviderProps<TItem, KFilter>) {
  const value = useTableProvider<TItem, KFilter>(values);

  return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
}

export default TableProvider;
