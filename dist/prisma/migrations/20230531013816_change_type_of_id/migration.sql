/*
  Warnings:

  - The primary key for the `Music` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `viewcount` on the `Music` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Album` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Artist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Notifications_Seen` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ResetPassword` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Likes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Notifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LyricTable` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Music" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "audio" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT 'default.jpg',
    "slug" TEXT NOT NULL,
    "artist_name" TEXT NOT NULL DEFAULT 'Unknown',
    "cat_id" TEXT NOT NULL,
    "public_year" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "artist_id" TEXT,
    "upload_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewcount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Music_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Music_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Music" ("artist_id", "artist_name", "audio", "cat_id", "id", "public_year", "slug", "thumbnail", "title", "upload_time", "viewcount") SELECT "artist_id", "artist_name", "audio", "cat_id", "id", "public_year", "slug", "thumbnail", "title", "upload_time", "viewcount" FROM "Music";
DROP TABLE "Music";
ALTER TABLE "new_Music" RENAME TO "Music";
CREATE UNIQUE INDEX "Music_slug_key" ON "Music"("slug");
CREATE TABLE "new_Album" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL DEFAULT 'Album is not named',
    "artist_id" TEXT,
    "cat_id" TEXT,
    "thumbnail" TEXT NOT NULL DEFAULT 'default_album.png',
    "slug" TEXT NOT NULL,
    "madedate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Album_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Album_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Album" ("artist_id", "cat_id", "id", "madedate", "slug", "thumbnail", "title") SELECT "artist_id", "cat_id", "id", "madedate", "slug", "thumbnail", "title" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
CREATE UNIQUE INDEX "Album_slug_key" ON "Album"("slug");
CREATE TABLE "new_Artist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT 'default_user.png',
    "slug" TEXT NOT NULL,
    "adddate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Artist" ("adddate", "id", "slug", "thumbnail", "title") SELECT "adddate", "id", "slug", "thumbnail", "title" FROM "Artist";
DROP TABLE "Artist";
ALTER TABLE "new_Artist" RENAME TO "Artist";
CREATE UNIQUE INDEX "Artist_slug_key" ON "Artist"("slug");
CREATE TABLE "new_Notifications_Seen" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "notification_id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    CONSTRAINT "Notifications_Seen_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "Notifications" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notifications_Seen_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Notifications_Seen" ("admin_id", "id", "notification_id") SELECT "admin_id", "id", "notification_id" FROM "Notifications_Seen";
DROP TABLE "Notifications_Seen";
ALTER TABLE "new_Notifications_Seen" RENAME TO "Notifications_Seen";
CREATE TABLE "new_ResetPassword" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "selector" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "useremail" TEXT NOT NULL,
    "expires" TEXT NOT NULL
);
INSERT INTO "new_ResetPassword" ("expires", "id", "selector", "token", "useremail") SELECT "expires", "id", "selector", "token", "useremail" FROM "ResetPassword";
DROP TABLE "ResetPassword";
ALTER TABLE "new_ResetPassword" RENAME TO "ResetPassword";
CREATE TABLE "new_Likes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userid" TEXT NOT NULL,
    "songid" TEXT NOT NULL,
    CONSTRAINT "Likes_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Likes_songid_fkey" FOREIGN KEY ("songid") REFERENCES "Music" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Likes" ("id", "songid", "userid") SELECT "id", "songid", "userid" FROM "Likes";
DROP TABLE "Likes";
ALTER TABLE "new_Likes" RENAME TO "Likes";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
CREATE TABLE "new_Notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT 'notificationdefault.jpg',
    "iconclasses" TEXT NOT NULL DEFAULT 'fas fa-question'
);
INSERT INTO "new_Notifications" ("iconclasses", "id", "seen", "thumbnail", "time", "title", "type") SELECT "iconclasses", "id", "seen", "thumbnail", "time", "title", "type" FROM "Notifications";
DROP TABLE "Notifications";
ALTER TABLE "new_Notifications" RENAME TO "Notifications";
CREATE TABLE "new_LyricTable" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "songid" TEXT NOT NULL,
    "lyrics" TEXT,
    "userid" TEXT NOT NULL,
    CONSTRAINT "LyricTable_songid_fkey" FOREIGN KEY ("songid") REFERENCES "Music" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LyricTable_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LyricTable" ("id", "lyrics", "songid", "userid") SELECT "id", "lyrics", "songid", "userid" FROM "LyricTable";
DROP TABLE "LyricTable";
ALTER TABLE "new_LyricTable" RENAME TO "LyricTable";
CREATE UNIQUE INDEX "LyricTable_songid_key" ON "LyricTable"("songid");
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT 'default_category.png'
);
INSERT INTO "new_Category" ("id", "slug", "thumbnail", "title") SELECT "id", "slug", "thumbnail", "title" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
