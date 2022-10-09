interface MetaResponse {
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    total: number;
    pageCount: number;
  };
}

interface BaseAttributes {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface BaseResponse<T> {
  data: {
    id: number;
    attributes: BaseAttributes & T;
  }[];
  meta: MetaResponse;
}
