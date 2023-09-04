/*
  Warnings:

  - You are about to drop the `ExerciseRightAnswer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "ExerciseRightAnswer_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ExerciseRightAnswer";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Answer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "exerciseId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Answer_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Answer" ("answer", "createdAt", "exerciseId", "id", "updatedAt") SELECT "answer", "createdAt", "exerciseId", "id", "updatedAt" FROM "Answer";
DROP TABLE "Answer";
ALTER TABLE "new_Answer" RENAME TO "Answer";
CREATE UNIQUE INDEX "Answer_id_key" ON "Answer"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
