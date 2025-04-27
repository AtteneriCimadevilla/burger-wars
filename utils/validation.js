const allowedSortFields = ["name", "price", "rating"];
const allowedSortOrders = ["ASC", "DESC"];

export function validateQueryParams(query) {
  const { sort, order, page, limit } = query;

  const validatedSort = allowedSortFields.includes(sort) ? sort : "rating";
  const validatedOrder = allowedSortOrders.includes(order?.toUpperCase())
    ? order.toUpperCase()
    : "DESC";

  const validatedPage =
    Number.isInteger(parseInt(page)) && parseInt(page) > 0 ? parseInt(page) : 1;
  const validatedLimit =
    Number.isInteger(parseInt(limit)) && parseInt(limit) > 0
      ? parseInt(limit)
      : 12;

  return { validatedSort, validatedOrder, validatedPage, validatedLimit };
}
