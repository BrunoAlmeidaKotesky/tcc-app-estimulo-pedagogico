/*
  Warnings:

  - You are about to drop the `Difficulty` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `difficultyId` on the `Exercise` table. All the data in the column will be lost.
  - Added the required column `difficulty` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Difficulty_weight_key";

-- DropIndex
DROP INDEX "Difficulty_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Difficulty";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "difficulty" INTEGER NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Exercise_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Exercise" ("createdAt", "description", "id", "subjectId", "title", "updatedAt") SELECT "createdAt", "description", "id", "subjectId", "title", "updatedAt" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
CREATE UNIQUE INDEX "Exercise_id_key" ON "Exercise"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
