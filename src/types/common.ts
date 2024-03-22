export interface IApiResponse<T> {
  message: string;
  statusCode: number;
  data: T;
}
