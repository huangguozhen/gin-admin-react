export interface TableListItem {
  thing_id?: string;
  product_key: string;
  func_type: string;
  identifier: string;
  func_name: string;
  data_type?: string;
  spec?: string;
  access_mode?: string;
  input_data?: string;
  output_data?: string;
  call_type?: string;
  event_type?: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  identifier?: string;
  func_type?: string;
  func_name?: string;
  product_key: string;
  pageSize?: number;
  currentPage?: number;
}
