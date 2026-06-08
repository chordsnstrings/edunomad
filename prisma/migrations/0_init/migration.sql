-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Tenant" AS ENUM ('edunomad', 'student', 'agency', 'service_partner');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('en', 'bn', 'hi', 'ne');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'deactivated', 'archived');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('super_admin', 'education_manager', 'counsellor_manager', 'counsellor', 'operations_manager', 'operations_team', 'compliance', 'finance', 'student', 'parent', 'agency_owner', 'agency_sub_counsellor', 'housing_partner', 'bank_partner', 'insurance_partner', 'transport_partner', 'sim_partner', 'test_prep_partner', 'pre_departure_coord', 'marketing', 'bd_manager', 'alumni');

-- CreateEnum
CREATE TYPE "SourceCountry" AS ENUM ('BD', 'IN', 'NP');

-- CreateEnum
CREATE TYPE "DestinationCountry" AS ENUM ('CA', 'UK', 'AU', 'MY');

-- CreateEnum
CREATE TYPE "DegreeLevel" AS ENUM ('foundation', 'diploma', 'bachelor', 'master', 'phd');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('scheduled', 'rescheduled', 'cancelled', 'completed');

-- CreateEnum
CREATE TYPE "DocStatus" AS ENUM ('requested', 'uploaded', 'under_review', 'approved', 'rework_requested', 'rejected');

-- CreateEnum
CREATE TYPE "SopStatus" AS ENUM ('draft', 'polished', 'locked');

-- CreateEnum
CREATE TYPE "ShortlistStatus" AS ENUM ('draft', 'locked', 'withdrawn');

-- CreateEnum
CREATE TYPE "VisaDecision" AS ENUM ('pending', 'approved', 'refused', 'info_requested');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('not_submitted', 'packaged', 'submitted', 'acknowledged', 'under_review', 'info_requested', 'offer_conditional', 'offer_unconditional', 'rejected', 'withdrawn');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('issued', 'paid', 'partially_paid', 'void', 'refunded');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('bkash', 'nagad', 'ssl', 'card', 'bank_transfer');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('initiated', 'succeeded', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "ParentInviteStatus" AS ENUM ('sent', 'accepted', 'expired');

-- CreateEnum
CREATE TYPE "CommType" AS ENUM ('call', 'message', 'whatsapp', 'email');

-- CreateEnum
CREATE TYPE "CommDirection" AS ENUM ('inbound', 'outbound');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('student', 'parent', 'counsellor', 'ops', 'ops_manager', 'counsellor_manager', 'compliance', 'finance', 'education_manager', 'super_admin', 'system', 'university');

-- CreateEnum
CREATE TYPE "AuditResult" AS ENUM ('success', 'denied', 'failed');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('expected', 'invoiced', 'received', 'reconciled', 'written_off');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('scheduled', 'processing', 'paid', 'failed');

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "companyName" TEXT NOT NULL DEFAULT 'EduNomad',
    "legalName" TEXT NOT NULL DEFAULT 'EduNomad Ltd.',
    "tagline" TEXT NOT NULL DEFAULT 'Study abroad, simplified.',
    "shortDescription" TEXT NOT NULL DEFAULT 'EduNomad helps students apply to universities abroad and complete the full journey to visa approval and arrival.',
    "longDescription" TEXT NOT NULL DEFAULT '',
    "logoText" TEXT NOT NULL DEFAULT 'EduNomad',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "foundingYear" INTEGER NOT NULL DEFAULT 2024,
    "defaultCountryCode" TEXT NOT NULL DEFAULT 'BD',
    "defaultPhone" TEXT NOT NULL DEFAULT '+880 1700 000000',
    "defaultWhatsapp" TEXT NOT NULL DEFAULT '+880 1700 000000',
    "email" TEXT NOT NULL DEFAULT 'hello@edunomad.app',
    "supportEmail" TEXT NOT NULL DEFAULT 'support@edunomad.app',
    "addressLine" TEXT NOT NULL DEFAULT 'Level 5, Gulshan Avenue',
    "city" TEXT NOT NULL DEFAULT 'Dhaka',
    "stateRegion" TEXT NOT NULL DEFAULT 'Dhaka',
    "postalCode" TEXT NOT NULL DEFAULT '1212',
    "country" TEXT NOT NULL DEFAULT 'Bangladesh',
    "mapUrl" TEXT,
    "businessHours" TEXT NOT NULL DEFAULT 'Sun–Thu, 10:00–18:00',
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "linkedinUrl" TEXT,
    "youtubeUrl" TEXT,
    "twitterUrl" TEXT,
    "tiktokUrl" TEXT,
    "whatsappCommunityUrl" TEXT,
    "siteUrl" TEXT NOT NULL DEFAULT 'https://edunomad.app',
    "metaTitle" TEXT NOT NULL DEFAULT 'EduNomad — Study abroad, simplified.',
    "metaDescription" TEXT NOT NULL DEFAULT 'Apply to universities in Canada, the UK, Australia and Malaysia with expert counsellors. Documents, applications, GIC and visa — handled end to end.',
    "metaKeywords" TEXT NOT NULL DEFAULT 'study abroad, student visa, university applications, study in canada, education consultant',
    "ogImageUrl" TEXT,
    "twitterHandle" TEXT NOT NULL DEFAULT '@edunomad',
    "themeColor" TEXT NOT NULL DEFAULT '#0B1A2E',
    "llmsSummary" TEXT NOT NULL DEFAULT '',
    "gaMeasurementId" TEXT,
    "gtmId" TEXT,
    "plausibleDomain" TEXT,
    "metaPixelId" TEXT,
    "showFloatingWhatsapp" BOOLEAN NOT NULL DEFAULT true,
    "showFloatingCall" BOOLEAN NOT NULL DEFAULT true,
    "geoEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryContact" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "countryName" TEXT NOT NULL,
    "flagEmoji" TEXT NOT NULL DEFAULT '',
    "whatsapp" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "displayName" TEXT NOT NULL DEFAULT '',
    "languages" TEXT NOT NULL DEFAULT 'en',
    "note" TEXT NOT NULL DEFAULT '',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CountryContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Administrator',
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'super_admin',
    "totpSecret" TEXT,
    "totpEnabledAt" TIMESTAMP(3),
    "recoveryCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "tenant" "Tenant" NOT NULL,
    "tenantId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "language" "Language" NOT NULL DEFAULT 'en',
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deactivatedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "tenantId" TEXT NOT NULL,
    "fullName" TEXT,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "language" "Language" NOT NULL DEFAULT 'en',
    "sourceCountry" "SourceCountry" NOT NULL DEFAULT 'BD',
    "sourceAttribution" JSONB,
    "dateOfBirth" TIMESTAMP(3),
    "academic" JSONB,
    "englishProficiency" JSONB,
    "destinations" JSONB,
    "fieldOfStudy" TEXT,
    "fieldCategory" TEXT,
    "budgetMinUsd" INTEGER,
    "budgetMaxUsd" INTEGER,
    "fundingSource" TEXT,
    "intakeTarget" JSONB,
    "completenessPct" INTEGER NOT NULL DEFAULT 0,
    "assignedCounsellorId" TEXT,
    "leadScore" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Institution" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" "DestinationCountry" NOT NULL,
    "city" TEXT NOT NULL,
    "tier" INTEGER NOT NULL DEFAULT 2,
    "tuitionMinUsd" INTEGER NOT NULL,
    "tuitionMaxUsd" INTEGER NOT NULL,
    "intakeMonths" INTEGER[],
    "englishMinIelts" DOUBLE PRECISION NOT NULL DEFAULT 6.0,
    "englishMinDuolingo" INTEGER NOT NULL DEFAULT 105,
    "englishMinPte" INTEGER NOT NULL DEFAULT 50,
    "acceptsMoiLetter" BOOLEAN NOT NULL DEFAULT false,
    "postStudyWorkYears" INTEGER NOT NULL DEFAULT 0,
    "scholarshipAvailable" BOOLEAN NOT NULL DEFAULT false,
    "dliOrEquivalentId" TEXT,
    "submissionTier" INTEGER NOT NULL DEFAULT 2,
    "admissionsEmail" TEXT,
    "portalUrl" TEXT,
    "commissionRateMinPct" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "commissionRateMaxPct" DOUBLE PRECISION NOT NULL DEFAULT 15,
    "paymentTermsDays" INTEGER NOT NULL DEFAULT 45,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Programme" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "degreeLevel" "DegreeLevel" NOT NULL,
    "fieldCategory" TEXT NOT NULL,
    "durationMonths" INTEGER NOT NULL DEFAULT 24,
    "tuitionPerYearUsd" INTEGER NOT NULL,
    "intakeMonthsSupported" INTEGER[],
    "englishMinSpecificIelts" DOUBLE PRECISION,
    "englishMinSpecificDuolingo" INTEGER,
    "minAcademicPercentage" DOUBLE PRECISION,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,

    CONSTRAINT "Programme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "counsellorUserId" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "durationMin" INTEGER NOT NULL DEFAULT 45,
    "status" "BookingStatus" NOT NULL DEFAULT 'scheduled',
    "rescheduleToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "storageKey" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "status" "DocStatus" NOT NULL DEFAULT 'uploaded',
    "qaResults" JSONB,
    "reworkReason" TEXT,
    "uploadedBy" TEXT NOT NULL,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'sev3',
    "status" TEXT NOT NULL DEFAULT 'open',
    "runbook" JSONB,
    "createdByUserId" TEXT NOT NULL,
    "resolvedAt" TIMESTAMP(3),
    "reviewScheduledAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingLog" (
    "id" TEXT NOT NULL,
    "staffName" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SopArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT,
    "ownerUserId" TEXT,
    "reviewerUserId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "blocks" JSONB NOT NULL DEFAULT '[]',
    "version" INTEGER NOT NULL DEFAULT 1,
    "publishedVersion" INTEGER,
    "publishedBlocks" JSONB,
    "translationStatus" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SopArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SopArticleVersion" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "blocks" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SopArticleVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SopView" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SopView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sop" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "SopStatus" NOT NULL DEFAULT 'draft',
    "plagiarismScore" DOUBLE PRECISION,
    "suggestions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SopVersion" (
    "id" TEXT NOT NULL,
    "sopId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "lockedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SopVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InboundEmail" (
    "id" TEXT NOT NULL,
    "fromAddress" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "referenceId" TEXT,
    "applicationId" TEXT,
    "classified" BOOLEAN NOT NULL DEFAULT false,
    "classification" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InboundEmail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bulletin" (
    "id" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "destination" TEXT,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bulletin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegulatorNotification" (
    "id" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "visaFileId" TEXT,
    "regulator" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegulatorNotification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegulatoryUpdate" (
    "id" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "effectiveDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegulatoryUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisaFile" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "destinationCountry" "DestinationCountry" NOT NULL,
    "checklistState" JSONB,
    "completenessPct" INTEGER NOT NULL DEFAULT 0,
    "prepStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readyForSignoffAt" TIMESTAMP(3),
    "signedOffAt" TIMESTAMP(3),
    "signedOffBy" TEXT,
    "registrationNumber" TEXT,
    "versionHash" TEXT,
    "submittedAt" TIMESTAMP(3),
    "submissionProof" JSONB,
    "decisionStatus" "VisaDecision" NOT NULL DEFAULT 'pending',
    "decisionAt" TIMESTAMP(3),
    "refusalReasons" JSONB,
    "returnedForChanges" BOOLEAN NOT NULL DEFAULT false,
    "returnReason" TEXT,
    "biometricsDoneAt" TIMESTAMP(3),
    "vfsAppointmentAt" TIMESTAMP(3),
    "passportReturnedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisaFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplianceSignOff" (
    "id" TEXT NOT NULL,
    "visaFileId" TEXT NOT NULL,
    "complianceUserId" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "versionHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplianceSignOff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RcicProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "registrationBody" TEXT NOT NULL,
    "registrationNumber" TEXT NOT NULL,
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RcicProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "programmeId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "shortlistStatus" "ShortlistStatus" NOT NULL DEFAULT 'draft',
    "rationale" TEXT,
    "recommendedByCounsellor" BOOLEAN NOT NULL DEFAULT false,
    "bucket" TEXT,
    "submissionStatus" "SubmissionStatus" NOT NULL DEFAULT 'not_submitted',
    "submissionMethod" TEXT,
    "referenceId" TEXT,
    "submittedAt" TIMESTAMP(3),
    "submissionProof" JSONB,
    "decisionStatus" TEXT,
    "decisionAt" TIMESTAMP(3),
    "offerUrl" TEXT,
    "conditions" JSONB,
    "opsApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationDocument" (
    "applicationId" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "roleInApp" TEXT NOT NULL,

    CONSTRAINT "ApplicationDocument_pkey" PRIMARY KEY ("applicationId","documentId","roleInApp")
);

-- CreateTable
CREATE TABLE "InstitutionCredential" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "portalUrl" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordEnc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstitutionCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QaReview" (
    "id" TEXT NOT NULL,
    "counsellorUserId" TEXT NOT NULL,
    "reviewerUserId" TEXT NOT NULL,
    "studentId" TEXT,
    "communicationId" TEXT,
    "scores" JSONB NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QaReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refund" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "requestedByUserId" TEXT NOT NULL,
    "amountLocal" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "reason" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'requested',
    "cmApprovedBy" TEXT,
    "financeApprovedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stage" TEXT NOT NULL DEFAULT 'applied',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingSession" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExitInterview" (
    "id" TEXT NOT NULL,
    "counsellorName" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExitInterview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OneOnOne" (
    "id" TEXT NOT NULL,
    "counsellorUserId" TEXT NOT NULL,
    "managerUserId" TEXT NOT NULL,
    "agenda" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OneOnOne_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamPost" (
    "id" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveRecord" (
    "id" TEXT NOT NULL,
    "counsellorUserId" TEXT NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeaveRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pip" (
    "id" TEXT NOT NULL,
    "counsellorUserId" TEXT NOT NULL,
    "managerUserId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "checkpoints" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "amountLocal" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "amountUsd" INTEGER NOT NULL,
    "purpose" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "InvoiceStatus" NOT NULL DEFAULT 'issued',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amountLocal" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "method" "PaymentMethod" NOT NULL,
    "externalRef" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'initiated',
    "approvedByUserId" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentInvite" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "parentPhone" TEXT NOT NULL,
    "pinHash" TEXT NOT NULL,
    "status" "ParentInviteStatus" NOT NULL DEFAULT 'sent',
    "parentUserId" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "ParentInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Communication" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "userId" TEXT,
    "type" "CommType" NOT NULL,
    "direction" "CommDirection" NOT NULL,
    "content" TEXT NOT NULL,
    "transcript" TEXT,
    "language" "Language" NOT NULL DEFAULT 'en',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Communication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounsellorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "photoUrl" TEXT,
    "languages" TEXT[],
    "destinations" TEXT[],
    "capacity" INTEGER NOT NULL DEFAULT 25,
    "tenureStartedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "managerId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CounsellorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "seq" BIGSERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "stage" INTEGER NOT NULL,
    "studentId" TEXT,
    "applicationId" TEXT,
    "actorType" "ActorType" NOT NULL,
    "actorId" TEXT,
    "visibility" JSONB NOT NULL,
    "channels" JSONB NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chainHash" TEXT NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRead" (
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventRead_pkey" PRIMARY KEY ("userId","eventId")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "seq" BIGSERIAL NOT NULL,
    "actorUserId" TEXT,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT,
    "beforeState" JSONB,
    "afterState" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "result" "AuditResult" NOT NULL DEFAULT 'success',
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chainHash" TEXT NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OtpChallenge" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "sendCount" INTEGER NOT NULL DEFAULT 1,
    "windowStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OtpChallenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "tenant" "Tenant" NOT NULL,
    "role" "UserRole" NOT NULL,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commission" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'edunomad',
    "applicationId" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "studentId" TEXT,
    "ratePct" DOUBLE PRECISION NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'CAD',
    "amountUsd" INTEGER NOT NULL,
    "status" "CommissionStatus" NOT NULL DEFAULT 'expected',
    "expectedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "reference" TEXT,
    "payoutId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Commission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL DEFAULT 'edunomad',
    "reference" TEXT NOT NULL,
    "amountUsd" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PayoutStatus" NOT NULL DEFAULT 'scheduled',
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "approvedByUserId" TEXT,
    "processedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CountryContact_countryCode_key" ON "CountryContact"("countryCode");

-- CreateIndex
CREATE INDEX "CountryContact_enabled_sortOrder_idx" ON "CountryContact"("enabled", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_tenant_tenantId_idx" ON "User"("tenant", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_phone_key" ON "Student"("phone");

-- CreateIndex
CREATE INDEX "Student_tenantId_idx" ON "Student"("tenantId");

-- CreateIndex
CREATE INDEX "Student_assignedCounsellorId_idx" ON "Student"("assignedCounsellorId");

-- CreateIndex
CREATE INDEX "Institution_country_idx" ON "Institution"("country");

-- CreateIndex
CREATE INDEX "Programme_institutionId_idx" ON "Programme"("institutionId");

-- CreateIndex
CREATE INDEX "Programme_fieldCategory_idx" ON "Programme"("fieldCategory");

-- CreateIndex
CREATE INDEX "Note_studentId_idx" ON "Note"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Note_studentId_authorUserId_key" ON "Note"("studentId", "authorUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_rescheduleToken_key" ON "Booking"("rescheduleToken");

-- CreateIndex
CREATE INDEX "Booking_counsellorUserId_startsAt_idx" ON "Booking"("counsellorUserId", "startsAt");

-- CreateIndex
CREATE INDEX "Document_studentId_documentType_idx" ON "Document"("studentId", "documentType");

-- CreateIndex
CREATE UNIQUE INDEX "SopArticle_slug_key" ON "SopArticle"("slug");

-- CreateIndex
CREATE INDEX "SopArticleVersion_articleId_idx" ON "SopArticleVersion"("articleId");

-- CreateIndex
CREATE INDEX "SopView_articleId_idx" ON "SopView"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "Sop_studentId_key" ON "Sop"("studentId");

-- CreateIndex
CREATE INDEX "SopVersion_sopId_idx" ON "SopVersion"("sopId");

-- CreateIndex
CREATE INDEX "InboundEmail_classified_idx" ON "InboundEmail"("classified");

-- CreateIndex
CREATE UNIQUE INDEX "VisaFile_applicationId_key" ON "VisaFile"("applicationId");

-- CreateIndex
CREATE INDEX "VisaFile_studentId_idx" ON "VisaFile"("studentId");

-- CreateIndex
CREATE INDEX "ComplianceSignOff_visaFileId_idx" ON "ComplianceSignOff"("visaFileId");

-- CreateIndex
CREATE UNIQUE INDEX "RcicProfile_userId_key" ON "RcicProfile"("userId");

-- CreateIndex
CREATE INDEX "Application_studentId_idx" ON "Application"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_studentId_programmeId_key" ON "Application"("studentId", "programmeId");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionCredential_institutionId_key" ON "InstitutionCredential"("institutionId");

-- CreateIndex
CREATE INDEX "QaReview_counsellorUserId_idx" ON "QaReview"("counsellorUserId");

-- CreateIndex
CREATE INDEX "Invoice_studentId_idx" ON "Invoice"("studentId");

-- CreateIndex
CREATE INDEX "Payment_invoiceId_idx" ON "Payment"("invoiceId");

-- CreateIndex
CREATE INDEX "ParentInvite_studentId_idx" ON "ParentInvite"("studentId");

-- CreateIndex
CREATE INDEX "ParentInvite_parentUserId_idx" ON "ParentInvite"("parentUserId");

-- CreateIndex
CREATE INDEX "Communication_studentId_createdAt_idx" ON "Communication"("studentId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "CounsellorProfile_userId_key" ON "CounsellorProfile"("userId");

-- CreateIndex
CREATE INDEX "Event_studentId_createdAt_idx" ON "Event"("studentId", "createdAt");

-- CreateIndex
CREATE INDEX "Event_applicationId_createdAt_idx" ON "Event"("applicationId", "createdAt");

-- CreateIndex
CREATE INDEX "Event_seq_idx" ON "Event"("seq");

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_createdAt_idx" ON "AuditLog"("actorUserId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_targetType_targetId_idx" ON "AuditLog"("targetType", "targetId");

-- CreateIndex
CREATE INDEX "AuditLog_seq_idx" ON "AuditLog"("seq");

-- CreateIndex
CREATE UNIQUE INDEX "OtpChallenge_phone_key" ON "OtpChallenge"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- CreateIndex
CREATE INDEX "PushSubscription_userId_idx" ON "PushSubscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Commission_applicationId_key" ON "Commission"("applicationId");

-- CreateIndex
CREATE INDEX "Commission_institutionId_idx" ON "Commission"("institutionId");

-- CreateIndex
CREATE INDEX "Commission_status_idx" ON "Commission"("status");

-- CreateIndex
CREATE INDEX "Commission_payoutId_idx" ON "Commission"("payoutId");

-- CreateIndex
CREATE UNIQUE INDEX "Payout_reference_key" ON "Payout"("reference");

-- CreateIndex
CREATE INDEX "Payout_status_idx" ON "Payout"("status");

-- AddForeignKey
ALTER TABLE "Programme" ADD CONSTRAINT "Programme_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationDocument" ADD CONSTRAINT "ApplicationDocument_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRead" ADD CONSTRAINT "EventRead_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

