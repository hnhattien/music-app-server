/*
  Warnings:

  - You are about to alter the column `expires` on the `ResetPassword` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ResetPassword" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "selector" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "useremail" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);
INSERT INTO "new_ResetPassword" ("expires", "id", "selector", "token", "useremail") SELECT "expires", "id", "selector", "token", "useremail" FROM "ResetPassword";
DROP TABLE "ResetPassword";
ALTER TABLE "new_ResetPassword" RENAME TO "ResetPassword";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
