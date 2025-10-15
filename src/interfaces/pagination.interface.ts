export interface IPagination {
  total?: number;
  page: number;
  limit: number;
  offset?: number;
  docs?: any[];
  data?: any[];
}
