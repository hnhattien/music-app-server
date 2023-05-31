-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LyricTable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "songid" INTEGER NOT NULL,
    "lyrics" TEXT,
    "userid" INTEGER NOT NULL,
    CONSTRAINT "LyricTable_songid_fkey" FOREIGN KEY ("songid") REFERENCES "Music" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LyricTable_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LyricTable" ("id", "lyrics", "songid", "userid") SELECT "id", "lyrics", "songid", "userid" FROM "LyricTable";
DROP TABLE "LyricTable";
ALTER TABLE "new_LyricTable" RENAME TO "LyricTable";
CREATE UNIQUE INDEX "LyricTable_songid_key" ON "LyricTable"("songid");
CREATE TABLE "new_Music" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "audio" TEXT NOT NULL,
    "music_thumbnail" TEXT NOT NULL DEFAULT 'default.jpg',
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
INSERT INTO "new_Music" ("artist_id", "artist_name", "audio", "cat_id", "id", "music_thumbnail", "public_year", "slug", "title", "upload_time", "viewcount") SELECT "artist_id", "artist_name", "audio", "cat_id", "id", "music_thumbnail", "public_year", "slug", "title", "upload_time", "viewcount" FROM "Music";
DROP TABLE "Music";
ALTER TABLE "new_Music" RENAME TO "Music";
CREATE UNIQUE INDEX "Music_slug_key" ON "Music"("slug");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "displayedName" TEXT NOT NULL DEFAULT 'Anonymous',
    "avatar" TEXT NOT NULL DEFAULT 'default_user.png',
    "role" TEXT NOT NULL DEFAULT 'user',
    "joinday" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("avatar", "displayedName", "email", "id", "joinday", "password", "role", "username") SELECT "avatar", "displayedName", "email", "id", "joinday", "password", "role", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
