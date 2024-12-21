export function getPositiveIntParam(
  params: URLSearchParams,
  name: string,
): number {
  const value = Number.parseInt(params.get(name) || '1', 10);
  return Number.isNaN(value) || value < 1 ? 1 : Math.floor(value);
}

export function getOptionsParam(
  params: URLSearchParams,
  name: string,
  options: T[],
): T {
  if (!options[0]) {
    throw new Error('options must have at least 1 item');
  }
  let value = params.get(name) || '';
  if (typeof options[0] === 'number') {
    value = Number.parseInt(value, 10);
  }
  return options.includes(value) ? value : options[0];
}
