export interface TableListItem {
  name: string;
  secret?: string;
  product_key?: string;
  node_type: number;
  net_type: number;
  data_format: number;
  description: number;
  status?: number;
  updated_at?: Date;
  created_at?: Date;
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
  name?: string;
  node_type?: number;
  pageSize?: number;
  currentPage?: number;
}
