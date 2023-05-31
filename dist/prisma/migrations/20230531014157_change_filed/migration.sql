-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Music" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "audio" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT 'default.jpg',
    "slug" TEXT NOT NULL,
    "artist_name" TEXT NOT NULL DEFAULT 'Unknown',
    "cat_id" TEXT,
    "public_year" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "artist_id" TEXT,
    "upload_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewcount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Music_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Music_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Music" ("artist_id", "artist_name", "audio", "cat_id", "id", "public_year", "slug", "thumbnail", "title", "upload_time", "viewcount") SELECT "artist_id", "artist_name", "audio", "cat_id", "id", "public_year", "slug", "thumbnail", "title", "upload_time", "viewcount" FROM "Music";
DROP TABLE "Music";
ALTER TABLE "new_Music" RENAME TO "Music";
CREATE UNIQUE INDEX "Music_slug_key" ON "Music"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
