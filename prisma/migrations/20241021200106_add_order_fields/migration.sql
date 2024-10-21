/*
Warnings:

- Added the required column `order` to the `Education` table without a default value. This is not possible if the table is not empty.
- Added the required column `order` to the `Experience` table without a default value. This is not possible if the table is not empty.
- Added the required column `order` to the `Project` table without a default value. This is not possible if the table is not empty.

 */
ALTER TABLE "Education"
ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Experience"
ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Project"
ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;