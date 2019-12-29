export interface TableListItem {
  topic_id?: string;
  product_key: string;
  username?: string;
  ip_addr?: string;
  client_id?: string;
  topic: string;
  access: number;
  allow: number;
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
  access?: number;
  allow?: number;
  topic?: string;
  product_key: string;
  pageSize?: number;
  currentPage?: number;
}
