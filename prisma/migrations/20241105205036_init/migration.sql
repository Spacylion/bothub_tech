-- AlterTable
ALTER TABLE "User" ADD COLUMN     "selectedModelId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_selectedModelId_fkey" FOREIGN KEY ("selectedModelId") REFERENCES "AiModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
