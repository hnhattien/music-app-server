import { get } from "lodash";

const getPaginationFromQuery = (query: any) => {
  // let page = Number(get(query, 'page'));
  // page = (isNaN(page) || page <= 0) ? 1 : page;
  // let limit = Number(query?.limit) || 20;
  let page = Number(get(query, "page", 1));
  page = page <= 0 ? 1 : page;
  let limit = Number(get(query, "limit", 20));
  limit = limit <= 0 || limit > 200 ? 20 : limit;
  const offset = (page - 1) * limit;
  const pagination = query?.pagination === "false" ? false : true;
  return { page, limit, offset, pagination };
};

export default {
  getPaginationFromQuery,
};
