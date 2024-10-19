/*
  Warnings:

  - You are about to drop the column `grade` on the `Grade` table. All the data in the column will be lost.
  - Added the required column `value` to the `Grade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "grade",
ADD COLUMN     "value" DECIMAL(65,30) NOT NULL;
