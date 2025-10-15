import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import parseQuery from './parseQuery';

export default function useParseQuery<T = Record<string, any>>(query?: string): T {
  const location = useLocation();
  return useMemo(() => parseQuery<any>(query), [query ?? location.search]);
}
