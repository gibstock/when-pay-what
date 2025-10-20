-- CreateEnum
CREATE TYPE "TrialType" AS ENUM ('FREE', 'INTRO_OFFER');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "trialAmount" DOUBLE PRECISION,
ADD COLUMN     "trialType" "TrialType";
