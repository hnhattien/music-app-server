/*
  Warnings:

  - You are about to drop the column `music_thumbnail` on the `Music` table. All the data in the column will be lost.
  - You are about to drop the column `artist_thumbnail` on the `Artist` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Music" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "audio" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT 'default.jpg',
    "slug" TEXT NOT NULL,
    "artist_name" TEXT NOT NULL DEFAULT 'Unknown',
    "cat_id" INTEGER NOT NULL DEFAULT 1,
    "public_year" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "artist_id" INTEGER,
    "upload_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewcount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Music_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Music_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Music" ("artist_id", "artist_name", "audio", "cat_id", "id", "public_year", "slug", "title", "upload_time", "viewcount") SELECT "artist_id", "artist_name", "audio", "cat_id", "id", "public_year", "slug", "title", "upload_time", "viewcount" FROM "Music";
DROP TABLE "Music";
ALTER TABLE "new_Music" RENAME TO "Music";
CREATE UNIQUE INDEX "Music_slug_key" ON "Music"("slug");
CREATE TABLE "new_Artist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT 'default_user.png',
    "slug" TEXT NOT NULL,
    "adddate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Artist" ("adddate", "id", "slug", "title") SELECT "adddate", "id", "slug", "title" FROM "Artist";
DROP TABLE "Artist";
ALTER TABLE "new_Artist" RENAME TO "Artist";
CREATE UNIQUE INDEX "Artist_slug_key" ON "Artist"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
