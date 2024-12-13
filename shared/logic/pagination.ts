export interface PaginationObject {
  current: number;
  max: number;

  prev?: string;
  next?: string;
  first?: string;
  last?: string;
}

export function genPagination(
  baseUrl: URL,
  current: number,
  max: number,
): PaginationObject {
  const pagination: PaginationObject = {
    current,
    max,
    prev: undefined,
    next: undefined,
    first: undefined,
    last: undefined,
  };

  if (current > 1) {
    baseUrl.searchParams.set('page', `${current - 1}`);
    pagination.prev = baseUrl.toString();

    baseUrl.searchParams.set('page', '1');
    pagination.first = baseUrl.toString();
  }

  if (current < max) {
    baseUrl.searchParams.set('page', `${current + 1}`);
    pagination.next = baseUrl.toString();

    baseUrl.searchParams.set('page', `${max}`);
    pagination.last = baseUrl.toString();
  }

  return pagination;
}
