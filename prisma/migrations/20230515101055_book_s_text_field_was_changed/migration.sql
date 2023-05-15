/*
  Warnings:

  - You are about to drop the column `text` on the `Book` table. All the data in the column will be lost.
  - Added the required column `textUrl` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "text",
ADD COLUMN     "textUrl" TEXT NOT NULL;
