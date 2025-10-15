/* eslint-disable quotes */
import QueryString from "qs";

export default function parseQuery<T extends Record<string, any>>(
  _query?: string
): T {
  const query = _query || window.location.search;
  if (!query) return {} as T;
  const search = query.replace("?", "");
  return QueryString.parse(search) as T;
}
