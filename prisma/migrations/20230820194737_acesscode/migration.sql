/*
  Warnings:

  - You are about to drop the column `acesss_code` on the `Child` table. All the data in the column will be lost.
  - Added the required column `accessCode` to the `Child` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Child" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "parentId" TEXT NOT NULL,
    "accessCode" TEXT NOT NULL,
    "verified" BOOLEAN DEFAULT false,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "Child_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Parent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Child" ("age", "createdAt", "id", "name", "parentId", "updatedAt", "verified") SELECT "age", "createdAt", "id", "name", "parentId", "updatedAt", "verified" FROM "Child";
DROP TABLE "Child";
ALTER TABLE "new_Child" RENAME TO "Child";
CREATE UNIQUE INDEX "Child_id_key" ON "Child"("id");
CREATE UNIQUE INDEX "Child_accessCode_key" ON "Child"("accessCode");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
