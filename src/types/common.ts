export interface ListResponse<T> {
  data: T[];
  pagination: PaginationParams;
}

export interface PaginationParams {
  page: number;
  limit: number;
  totalRows: number;
}

export interface ListParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';

  [key: string]: any;
}
