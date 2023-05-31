import { Application } from "express";
import categoryController from "./category.controller";
export const categoryRoutes = (app: Application) => {
  app.get("/category", categoryController.getCategories);
};
