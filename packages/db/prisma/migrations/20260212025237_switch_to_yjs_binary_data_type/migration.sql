/*
  Warnings:

  - The `content` column on the `Document` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `content` column on the `DocumentVersion` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "content",
ADD COLUMN     "content" BYTEA;

-- AlterTable
ALTER TABLE "DocumentVersion" DROP COLUMN "content",
ADD COLUMN     "content" BYTEA;
