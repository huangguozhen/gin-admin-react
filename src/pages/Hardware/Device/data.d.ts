export interface TableListItem {
  iot_id: string;
  name: string;
  product_key: string;
  secret?: string;
  nickname?: string;
  utc_active?: Date;
  utc_online?: Date;
  fw_version?: string;
  ip_addr?: string;
  node_type: number;
  status?: string;
  updatedAt?: Date;
  createdAt?: Date;
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
  product_key?: string;
  status?: string;
  name?: string;
  nickname?: string;
  node_type?: number;
  pageSize?: number;
  currentPage?: number;
}
