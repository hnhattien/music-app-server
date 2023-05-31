-- CreateTable
CREATE TABLE "Artist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT 'default_user.png',
    "slug" TEXT NOT NULL,
    "adddate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT 'default_category.png'
);

-- CreateTable
CREATE TABLE "Album" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL DEFAULT 'Album is not named',
    "artist_id" INTEGER NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT 'default_album.png',
    "slug" TEXT NOT NULL,
    "madedate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Album_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "displayedName" TEXT NOT NULL DEFAULT 'Anonymous',
    "avatar" TEXT NOT NULL DEFAULT 'default_user.png',
    "role" TEXT NOT NULL DEFAULT 'user',
    "joinday" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Music" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "audio" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT 'default.jpg',
    "slug" TEXT NOT NULL,
    "artist_name" TEXT NOT NULL DEFAULT 'Unknown',
    "cat_id" INTEGER NOT NULL,
    "public_year" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "artist_id" INTEGER NOT NULL,
    "upload_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewcount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Music_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Music_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "Artist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Likes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userid" INTEGER NOT NULL,
    "songid" INTEGER NOT NULL,
    CONSTRAINT "Likes_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Likes_songid_fkey" FOREIGN KEY ("songid") REFERENCES "Music" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LyricTable" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "songid" INTEGER NOT NULL,
    "lyrics" TEXT NOT NULL,
    "userid" INTEGER NOT NULL,
    CONSTRAINT "LyricTable_songid_fkey" FOREIGN KEY ("songid") REFERENCES "Music" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LyricTable_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT 'notificationdefault.jpg',
    "iconclasses" TEXT NOT NULL DEFAULT 'fas fa-question'
);

-- CreateTable
CREATE TABLE "Notifications_Seen" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "notification_id" INTEGER NOT NULL,
    "admin_id" INTEGER NOT NULL,
    CONSTRAINT "Notifications_Seen_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "Notifications" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Notifications_Seen_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ResetPassword" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "selector" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "useremail" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Artist_slug_key" ON "Artist"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Album_slug_key" ON "Album"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Music_slug_key" ON "Music"("slug");
