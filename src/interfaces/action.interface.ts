export interface IAction {
  type: string;
  icon?: any;
  name?: string;
  action: (item: any, $e: any) => void;
}
