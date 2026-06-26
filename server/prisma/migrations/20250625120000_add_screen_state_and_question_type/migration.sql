-- CreateEnum
CREATE TYPE "ScreenState" AS ENUM ('LINKED', 'ANSWERS', 'JUDGES', 'SCORES');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('NORMAL', 'DOBON');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN "screenState" "ScreenState" NOT NULL DEFAULT 'LINKED';

-- AlterTable
ALTER TABLE "Question" ADD COLUMN "type" "QuestionType" NOT NULL DEFAULT 'NORMAL';
