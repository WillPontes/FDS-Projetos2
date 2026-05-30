export async function resolveWithMock<T>(
  request: () => Promise<T>,
  resolver: () => T | Promise<T>,
): Promise<T> {
  void request().catch(() => {});
  return resolver();
}
