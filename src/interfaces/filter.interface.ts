import { ISelect } from './select.interface';
import { FilterTypeEnum } from '../enums/filter-type.enum';

export interface IFilter {
  key: string;
  label: string;
  type: FilterTypeEnum;
  value?: string | number | (string | number)[];
  options?: ISelect[];
}
