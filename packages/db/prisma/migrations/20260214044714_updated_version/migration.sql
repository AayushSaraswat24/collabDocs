/*
  Warnings:

  - Made the column `content` on table `DocumentVersion` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DocumentVersion" ADD COLUMN     "name" TEXT,
ALTER COLUMN "content" SET NOT NULL;
