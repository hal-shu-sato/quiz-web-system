-- CreateEnum
CREATE TYPE "public"."State" AS ENUM ('WAIT', 'QUESTION', 'ANSWER', 'JUDGE', 'ANSWER_CHECK', 'JUDGE_CHECK');

-- CreateEnum
CREATE TYPE "public"."AnswerType" AS ENUM ('TEXT', 'IMAGE');

-- CreateEnum
CREATE TYPE "public"."JudgmentResult" AS ENUM ('PENDING', 'CORRECT', 'PARTIAL', 'INCORRECT', 'DOBON');

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL DEFAULT '',
    "currentQuestionId" UUID,
    "state" "public"."State" NOT NULL DEFAULT 'WAIT',
    "code" TEXT,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Participant" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sessionId" UUID NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "score" INTEGER NOT NULL DEFAULT 0,
    "isDobon" BOOLEAN NOT NULL DEFAULT false,
    "reconnectionCode" TEXT,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Question" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sessionId" UUID NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "maxPoints" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Answer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "participantId" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answerType" "public"."AnswerType" NOT NULL DEFAULT 'TEXT',
    "answerText" TEXT,
    "answerImagePath" TEXT,
    "judgmentResult" "public"."JudgmentResult" NOT NULL DEFAULT 'PENDING',
    "awardedPoints" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_currentQuestionId_key" ON "public"."Session"("currentQuestionId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_code_key" ON "public"."Session"("code");

-- CreateIndex
CREATE INDEX "Participant_sessionId_idx" ON "public"."Participant"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_sessionId_reconnectionCode_key" ON "public"."Participant"("sessionId", "reconnectionCode");

-- CreateIndex
CREATE INDEX "Question_sessionId_idx" ON "public"."Question"("sessionId");

-- CreateIndex
CREATE INDEX "Answer_participantId_idx" ON "public"."Answer"("participantId");

-- CreateIndex
CREATE INDEX "Answer_questionId_idx" ON "public"."Answer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_participantId_questionId_key" ON "public"."Answer"("participantId", "questionId");

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_currentQuestionId_fkey" FOREIGN KEY ("currentQuestionId") REFERENCES "public"."Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Participant" ADD CONSTRAINT "Participant_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Answer" ADD CONSTRAINT "Answer_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "public"."Participant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
