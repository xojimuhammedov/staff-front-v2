import { useContext } from 'react';
import { TableContext } from './TableProvider';

const useTableContext = () => {
  const context = useContext(TableContext);

  if (!context) {
    throw new Error('Component need to be wrapped by TableProvider');
  }

  return context;
};

export default useTableContext;
