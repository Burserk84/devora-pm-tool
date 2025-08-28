-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('SUPERADMIN', 'USER');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'USER';
