import { useNavigate } from 'react-router-dom';
import useParseQuery from './use-parse-query';
import QueryString from 'qs';

export default function useQuery<T = Record<string, any>>() {
  const query = useParseQuery<T>();
  const history = useNavigate();

  const setQuery = (value: T, pathname?: string) => {
    history({ pathname, search: QueryString.stringify(value) });
  };

  return [query, setQuery] as [typeof query, typeof setQuery];
}
