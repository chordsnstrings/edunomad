-- Stage 9 gains a real ServiceBooking table (CLAUDE.md §4 core entity), every
-- business-data entity gains tenantId (§1.9), and the catalogue gains the
-- natural keys that let a deploy upsert instead of duplicate.

-- Backfill: tenantId had no default, so four writers each invented a value —
-- the student's own uuid, the invite's studentId, the literal 'student'. One
-- convention now: business data belongs to the operating tenant ('edunomad'),
-- user accounts belong to their tenant type.
UPDATE "Student" SET "tenantId" = 'edunomad';
UPDATE "User" SET "tenantId" = 'edunomad' WHERE tenant = 'edunomad';
UPDATE "User" SET "tenantId" = 'student'  WHERE tenant = 'student';

-- The catalogue unique keys below cannot be created over pre-existing
-- duplicates. Remove only duplicates nothing points at; anything with
-- dependents needs a human, so raise rather than guess which row is canonical.
DELETE FROM "Programme" p
 WHERE p.id <> (SELECT MIN(q.id) FROM "Programme" q
                 WHERE q."institutionId" = p."institutionId" AND q.name = p.name
                   AND q."degreeLevel" = p."degreeLevel")
   AND NOT EXISTS (SELECT 1 FROM "Application" a WHERE a."programmeId" = p.id);

DELETE FROM "Institution" i
 WHERE i.id <> (SELECT MIN(j.id) FROM "Institution" j
                 WHERE j.name = i.name AND j.country = i.country)
   AND NOT EXISTS (SELECT 1 FROM "Programme"   x WHERE x."institutionId" = i.id)
   AND NOT EXISTS (SELECT 1 FROM "Application" y WHERE y."institutionId" = i.id)
   AND NOT EXISTS (SELECT 1 FROM "Commission"  z WHERE z."institutionId" = i.id);

DO $$
DECLARE n int;
BEGIN
  SELECT count(*) INTO n FROM (
    SELECT 1 FROM "Institution" GROUP BY name, country HAVING count(*) > 1
  ) d;
  IF n > 0 THEN
    RAISE EXCEPTION 'Institution has % duplicate (name, country) group(s) with dependent rows; merge them before applying this migration', n;
  END IF;
END $$;

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('housing', 'bank', 'sim', 'insurance', 'transport', 'test_prep');

-- CreateEnum
CREATE TYPE "ServiceBookingStatus" AS ENUM ('requested', 'matched', 'confirmed', 'cancelled');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "tenantId" TEXT NOT NULL DEFAULT 'edunomad';

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "tenantId" TEXT NOT NULL DEFAULT 'edunomad';

-- AlterTable
ALTER TABLE "Communication" ADD COLUMN     "tenantId" TEXT NOT NULL DEFAULT 'edunomad';

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "tenantId" TEXT NOT NULL DEFAULT 'edunomad';

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "tenantId" TEXT NOT NULL DEFAULT 'edunomad';

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "tenantId" TEXT NOT NULL DEFAULT 'edunomad';

-- AlterTable
ALTER TABLE "ParentInvite" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "tenantId" TEXT NOT NULL DEFAULT 'edunomad';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "tenantId" TEXT NOT NULL DEFAULT 'edunomad';

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "tenantId" SET DEFAULT 'edunomad';

-- AlterTable
ALTER TABLE "VisaFile" ADD COLUMN     "tenantId" TEXT NOT NULL DEFAULT 'edunomad';

-- CreateTable
CREATE TABLE "ServicePartner" (
    "id" TEXT NOT NULL,
    "tenant" "Tenant" NOT NULL DEFAULT 'service_partner',
    "tenantId" TEXT NOT NULL DEFAULT 'service_partner',
    "name" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "country" "DestinationCountry" NOT NULL DEFAULT 'CA',
    "city" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "leadTimeDays" INTEGER NOT NULL DEFAULT 7,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServicePartner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceBooking" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'edunomad',
    "studentId" TEXT NOT NULL,
    "serviceType" "ServiceType" NOT NULL,
    "partnerId" TEXT,
    "status" "ServiceBookingStatus" NOT NULL DEFAULT 'requested',
    "notes" TEXT,
    "details" JSONB,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServicePartner_serviceType_active_idx" ON "ServicePartner"("serviceType", "active");

-- CreateIndex
CREATE UNIQUE INDEX "ServicePartner_name_serviceType_key" ON "ServicePartner"("name", "serviceType");

-- CreateIndex
CREATE INDEX "ServiceBooking_studentId_idx" ON "ServiceBooking"("studentId");

-- CreateIndex
CREATE INDEX "ServiceBooking_status_requestedAt_idx" ON "ServiceBooking"("status", "requestedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceBooking_studentId_serviceType_key" ON "ServiceBooking"("studentId", "serviceType");

-- CreateIndex
CREATE UNIQUE INDEX "Institution_name_country_key" ON "Institution"("name", "country");

-- CreateIndex
CREATE UNIQUE INDEX "Programme_institutionId_name_degreeLevel_key" ON "Programme"("institutionId", "name", "degreeLevel");

-- AddForeignKey
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "ServicePartner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

