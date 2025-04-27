export function generatePaginationLinks(
  req,
  currentPage,
  totalPages,
  perPage,
  sort,
  order
) {
  const baseUrl = `${req.headers["x-forwarded-proto"] || "http"}://${
    req.headers.host
  }${req.url.split("?")[0]}`;

  const baseQuery = `limit=${perPage}${sort ? `&sort=${sort}` : ""}${
    order ? `&order=${order}` : ""
  }`;

  return {
    self: `${baseUrl}?${baseQuery}&page=${currentPage}`,
    next:
      currentPage < totalPages
        ? `${baseUrl}?${baseQuery}&page=${currentPage + 1}`
        : null,
    prev:
      currentPage > 1
        ? `${baseUrl}?${baseQuery}&page=${currentPage - 1}`
        : null,
  };
}
