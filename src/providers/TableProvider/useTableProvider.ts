import { useEffect, useReducer } from 'react';
import { produce } from 'immer';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { get } from 'lodash';

interface TableState<TItem, KFilter> {
  columns: DataGridColumnType[];
  filter: KFilter;
  rows: TItem[];
  columnHash: Record<string, DataGridColumnType>;
  keyExtractor: string;
}

export enum TABLE_ACTION_TYPES {
  TOGGLE_VISIBILITY = 'toggleVisibility',
  TOGGLE_MULTIPLE_COLUMNS_VISIBILITY = 'toggleMultipleColumnsVisibility',
  RESET_COLUMNS_VISIBILITY = 'resetColumnsVisibility',
  UPDATE_ROWS = 'updateRows'
}

export type ToggleColumnVisibilityAction = {
  type: TABLE_ACTION_TYPES.TOGGLE_VISIBILITY;
  payload: string;
};

export type ToggleMultipleColumnsVisibility = {
  type: TABLE_ACTION_TYPES.TOGGLE_MULTIPLE_COLUMNS_VISIBILITY;
  payload: Record<string, DataGridColumnType>;
};

export type UpdateRows = {
  type: TABLE_ACTION_TYPES.UPDATE_ROWS;
  payload: any;
};

export type ResetColumnsVisibility = {
  type: TABLE_ACTION_TYPES.RESET_COLUMNS_VISIBILITY;
};

export type TableActions =
  | ToggleColumnVisibilityAction
  | ToggleMultipleColumnsVisibility
  | UpdateRows
  | ResetColumnsVisibility;

const prepareHash = (columns: DataGridColumnType[]) =>
  columns.reduce((acc, cur) => ({ ...acc, [cur.key]: { ...cur, visible: true } }), {});

const reducer = (state: TableState<any, any>, action: TableActions) => {
  switch (action.type) {
    case TABLE_ACTION_TYPES.TOGGLE_VISIBILITY:
      return produce(state, (draft) => {
        draft.columnHash[action.payload].visible = !draft.columnHash[action.payload].visible;
      });
    case TABLE_ACTION_TYPES.TOGGLE_MULTIPLE_COLUMNS_VISIBILITY:
      return produce(state, (draft) => {
        Object.entries(action.payload).forEach(([updatedKey, updatedValue]) => {
          draft.columnHash[updatedKey].visible = updatedValue.visible;
        });
      });
    case TABLE_ACTION_TYPES.RESET_COLUMNS_VISIBILITY:
      return produce(state, (draft) => {
        draft.columnHash = Object.entries(draft.columnHash).reduce(
          (acc, [key, value]) => ({ ...acc, [key]: { ...value, visible: true } }),
          {}
        );
      });
    case TABLE_ACTION_TYPES.UPDATE_ROWS:
      return {
        ...state,
        ...get(action, 'payload', {})
      };
    default:
      return state;
  }
};

const useTableProvider = <TItem, KFilter>({
  columns,
  rows,
  filter,
  keyExtractor
}: {
  columns: DataGridColumnType[];
  rows: TItem[];
  filter: KFilter;
  keyExtractor: string;
}) => {
  const [state, dispatch] = useReducer(reducer, {
    columns,
    filter,
    rows,
    keyExtractor,
    columnHash: prepareHash(columns)
  });

  useEffect(() => {
    dispatch({
      type: TABLE_ACTION_TYPES.UPDATE_ROWS,
      payload: {
        columns,
        filter,
        rows,
        keyExtractor,
        columnHash: prepareHash(columns)
      }
    });
  }, [JSON.stringify(rows)]);

  return {
    ...state,
    dispatch
  };
};

export default useTableProvider;
