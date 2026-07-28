-- CreateIndex
CREATE INDEX "Application_submissionStatus_idx" ON "Application"("submissionStatus");

-- CreateIndex
CREATE INDEX "Application_shortlistStatus_idx" ON "Application"("shortlistStatus");

-- CreateIndex
CREATE INDEX "Event_type_createdAt_idx" ON "Event"("type", "createdAt");

-- CreateIndex
CREATE INDEX "Event_studentId_type_idx" ON "Event"("studentId", "type");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE INDEX "Payment_status_createdAt_idx" ON "Payment"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Refund_stage_idx" ON "Refund"("stage");

-- CreateIndex
CREATE INDEX "Refund_studentId_idx" ON "Refund"("studentId");

-- CreateIndex
CREATE INDEX "VisaFile_decisionStatus_idx" ON "VisaFile"("decisionStatus");

-- CreateIndex
CREATE INDEX "VisaFile_readyForSignoffAt_signedOffAt_idx" ON "VisaFile"("readyForSignoffAt", "signedOffAt");

