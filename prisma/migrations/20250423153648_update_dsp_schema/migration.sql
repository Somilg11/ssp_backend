/*
  Warnings:

  - Added the required column `name` to the `DSP` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DSP" ADD COLUMN     "name" TEXT NOT NULL;
