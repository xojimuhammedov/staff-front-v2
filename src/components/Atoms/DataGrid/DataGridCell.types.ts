import { CSSProperties, ReactNode } from 'react';

export type DataGridColumnType<T = any> = {
  key: string;
  label: string;
  className?: string;
  headerClassName?: string;
  header?: ReactNode;
  align?: CSSProperties['textAlign'];
  cellRender?: (row: T) => ReactNode;
  type?: 'first-capital-letter' | 'link' | 'social';
  visible?: boolean;
  truncated?: boolean;
  exportKey?: string;
};
