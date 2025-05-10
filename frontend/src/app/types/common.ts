export interface IRequestBody<T> {
  data: T;
  options?: {
    headers?: Record<string, string>;
    baseUrl?: string;
  };
}

export interface IPaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface IFilterParams {
  search?: string;
  status?: "active" | "inactive" | "pending" | "completed" | "cancelled";
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  location?: string;
  rating?: number;
  [key: string]: string | number | undefined;
}

export interface IQueryParams extends IPaginationParams, IFilterParams {}
