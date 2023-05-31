/*
  Warnings:

  - A unique constraint covering the columns `[songid]` on the table `LyricTable` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LyricTable_songid_key" ON "LyricTable"("songid");
