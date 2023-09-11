class PaginatedResponse<T> {
  constructor(
    public data: T[] | null,
    public skip: number,
    public limit: number,
    public total: number,
  ) {}
}

export default PaginatedResponse;
