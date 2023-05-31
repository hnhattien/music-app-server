"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const getPaginationFromQuery = (query) => {
    // let page = Number(get(query, 'page'));
    // page = (isNaN(page) || page <= 0) ? 1 : page;
    // let limit = Number(query?.limit) || 20;
    let page = Number((0, lodash_1.get)(query, "page", 1));
    page = page <= 0 ? 1 : page;
    let limit = Number((0, lodash_1.get)(query, "limit", 20));
    limit = limit <= 0 || limit > 200 ? 20 : limit;
    const offset = (page - 1) * limit;
    const pagination = (query === null || query === void 0 ? void 0 : query.pagination) === "false" ? false : true;
    return { page, limit, offset, pagination };
};
exports.default = {
    getPaginationFromQuery,
};
