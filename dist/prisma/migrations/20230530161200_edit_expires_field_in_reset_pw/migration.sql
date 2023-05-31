-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT 'Album is not named',
    "artist_id" INTEGER,
    "cat_id" INTEGER,
    "thumbnail" TEXT NOT NULL DEFAULT 'default_album.png',
    "slug" TEXT NOT NULL,
    "madedate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Album_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Album_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Album" ("artist_id", "id", "madedate", "slug", "thumbnail", "title") SELECT "artist_id", "id", "madedate", "slug", "thumbnail", "title" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
CREATE UNIQUE INDEX "Album_slug_key" ON "Album"("slug");
CREATE TABLE "new_ResetPassword" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "selector" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "useremail" TEXT NOT NULL,
    "expires" TEXT NOT NULL
);
INSERT INTO "new_ResetPassword" ("expires", "id", "selector", "token", "useremail") SELECT "expires", "id", "selector", "token", "useremail" FROM "ResetPassword";
DROP TABLE "ResetPassword";
ALTER TABLE "new_ResetPassword" RENAME TO "ResetPassword";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
