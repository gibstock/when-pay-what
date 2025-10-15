-- CreateEnum
CREATE TYPE "RecurrencePeriod" AS ENUM ('WEEKLY', 'MONTHLY', 'YEARLY');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recurrencePeriod" "RecurrencePeriod";
