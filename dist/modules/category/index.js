"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryRoutes = void 0;
const category_controller_1 = __importDefault(require("./category.controller"));
const categoryRoutes = (app) => {
    app.get("/category", category_controller_1.default.getCategories);
};
exports.categoryRoutes = categoryRoutes;
