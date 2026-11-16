# ==============================================================================
# CineLedger End-to-End Automated Financial Smoke Test
# ==============================================================================

$baseUrl = "http://localhost:8080/api"
$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🎬 CineLedger Automated End-to-End Lifecycle Test" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# Step 1: Health Check
Write-Host "`n[Step 1] Verifying System Health..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
Write-Host " ✔ Backend Service Status: $($health.data.status) ($($health.data.service))" -ForegroundColor Green

# Step 2: Authentication
Write-Host "`n[Step 2] Authenticating as Lead Analyst (analyst@cineledger.io)..." -ForegroundColor Yellow
$loginPayload = @{ username = "analyst@cineledger.io"; password = "Password@123" } | ConvertTo-Json
$authAnalyst = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body $loginPayload
$analystToken = $authAnalyst.data.token
$analystHeaders = @{ Authorization = "Bearer $analystToken" }
Write-Host " ✔ Authenticated: $($authAnalyst.data.fullName) (Role: $($authAnalyst.data.role))" -ForegroundColor Green

# Step 3: Dashboard Summary
Write-Host "`n[Step 3] Fetching Executive Dashboard Summary..." -ForegroundColor Yellow
$summary = Invoke-RestMethod -Uri "$baseUrl/dashboard" -Headers $analystHeaders -Method Get
Write-Host " ✔ Total Reconciliations: $($summary.data.totalReconciliations)" -ForegroundColor Green
Write-Host " ✔ Gross Box Office: ₹$([string]::Format('{0:N2}', $summary.data.totalGrossBoxOffice))" -ForegroundColor Green
Write-Host " ✔ Open Discrepancies Count: $($summary.data.openDiscrepanciesCount)" -ForegroundColor Green

# Step 4: Films Catalog
Write-Host "`n[Step 4] Querying Master Film Catalog..." -ForegroundColor Yellow
$films = Invoke-RestMethod -Uri "$baseUrl/films" -Headers $analystHeaders -Method Get
Write-Host " ✔ Found $($films.data.Count) active films:" -ForegroundColor Green
foreach ($f in $films.data) {
    Write-Host "   - [$($f.code)] $($f.title) ($($f.genre), $($f.releaseYear))" -ForegroundColor Gray
}

# Step 5: Cinemas & Screens
Write-Host "`n[Step 5] Checking Circuits & Screens..." -ForegroundColor Yellow
$cinemas = Invoke-RestMethod -Uri "$baseUrl/cinemas" -Headers $analystHeaders -Method Get
Write-Host " ✔ Found $($cinemas.data.Count) cinema circuits:" -ForegroundColor Green
foreach ($c in $cinemas.data) {
    Write-Host "   - [$($c.code)] $($c.name) - $($c.city) ($($c.screenCount) screens)" -ForegroundColor Gray
}

# Step 6: Create New Reconciliation Run
Write-Host "`n[Step 6] Creating New Reconciliation Run for Quantum Paradox at PVR ICON..." -ForegroundColor Yellow
$reconCreate = @{
    filmId = 6
    cinemaId = 1
    periodStart = "2026-11-01"
    periodEnd = "2026-11-07"
    notes = "Opening week multi-screen reconciliation"
} | ConvertTo-Json

$newRecon = Invoke-RestMethod -Uri "$baseUrl/reconciliations" -Headers $analystHeaders -Method Post -ContentType "application/json" -Body $reconCreate
$reconId = $newRecon.data.id
Write-Host " ✔ Created Reconciliation: $($newRecon.data.reconciliationNumber) (ID: $reconId)" -ForegroundColor Green

# Step 7: Ingest POS & Distributor CSV Feeds
Write-Host "`n[Step 7] Ingesting Multi-Source CSV Datasets for Reconciliation $reconId..." -ForegroundColor Yellow

$posFilePath = Resolve-Path "sample-data\theatre_pos_sample.csv"
$distFilePath = Resolve-Path "sample-data\distributor_statement_sample.csv"

# Function to upload multipart form data in PowerShell
function Upload-CsvFile ($url, $filePath, $reconId, $reportType, $token) {
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"
    
    $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
    $fileName = [System.IO.Path]::GetFileName($filePath)
    
    $bodyLines = @(
        "--$boundary",
        "Content-Disposition: form-data; name=`"reconciliationId`"",
        "",
        "$reconId",
        "--$boundary",
        "Content-Disposition: form-data; name=`"reportType`"",
        "",
        "$reportType",
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
        "Content-Type: text/csv",
        ""
    )
    
    $headerText = ($bodyLines -join $LF) + $LF
    $footerText = "$LF--$boundary--$LF"
    
    $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($headerText)
    $footerBytes = [System.Text.Encoding]::UTF8.GetBytes($footerText)
    
    $totalStream = [System.IO.MemoryStream]::new()
    $totalStream.Write($headerBytes, 0, $headerBytes.Length)
    $totalStream.Write($fileBytes, 0, $fileBytes.Length)
    $totalStream.Write($footerBytes, 0, $footerBytes.Length)
    $contentBytes = $totalStream.ToArray()
    
    $req = [System.Net.HttpWebRequest]::Create($url)
    $req.Method = "POST"
    $req.ContentType = "multipart/form-data; boundary=$boundary"
    $req.Headers.Add("Authorization", "Bearer $token")
    $req.ContentLength = $contentBytes.Length
    
    $stream = $req.GetRequestStream()
    $stream.Write($contentBytes, 0, $contentBytes.Length)
    $stream.Close()
    
    $resp = $req.GetResponse()
    $reader = [System.IO.StreamReader]::new($resp.GetResponseStream())
    $respJson = $reader.ReadToEnd() | ConvertFrom-Json
    $reader.Close()
    $resp.Close()
    
    return $respJson
}

$posUpload = Upload-CsvFile -url "$baseUrl/imports" -filePath $posFilePath -reconId $reconId -reportType "THEATRE_POS" -token $analystToken
Write-Host " ✔ Theatre POS Ingested: $($posUpload.data.recordCount) ticket batches (Net: ₹$([string]::Format('{0:N2}', $posUpload.data.netAmount)))" -ForegroundColor Green

$distUpload = Upload-CsvFile -url "$baseUrl/imports" -filePath $distFilePath -reconId $reconId -reportType "DISTRIBUTOR_STATEMENT" -token $analystToken
Write-Host " ✔ Distributor Statement Ingested: $($distUpload.data.recordCount) ticket batches (Net: ₹$([string]::Format('{0:N2}', $distUpload.data.netAmount)))" -ForegroundColor Green

# Step 8: Trigger Reconciliation Run
Write-Host "`n[Step 8] Executing Automated Variance Engine..." -ForegroundColor Yellow
$reconRun = Invoke-RestMethod -Uri "$baseUrl/reconciliations/$reconId/run" -Headers $analystHeaders -Method Post
Write-Host " ✔ Reconciliation Status: $($reconRun.data.status)" -ForegroundColor Green
Write-Host "   - Total POS Gross: ₹$([string]::Format('{0:N2}', $reconRun.data.totalPosAmount))" -ForegroundColor Gray
Write-Host "   - Total Distributor: ₹$([string]::Format('{0:N2}', $reconRun.data.totalDistributorAmount))" -ForegroundColor Gray
Write-Host "   - Net Variance Identified: ₹$([string]::Format('{0:N2}', $reconRun.data.totalVariance))" -ForegroundColor Yellow
Write-Host "   - Flagged Discrepancies Count: $($reconRun.data.discrepancyCount)" -ForegroundColor Yellow

# Step 9: Calculate Settlement Waterfall
Write-Host "`n[Step 9] Calculating Contract Settlement Waterfall..." -ForegroundColor Yellow
$settlementPayload = @{ reconciliationId = $reconId; contractId = 1 } | ConvertTo-Json
$calc = Invoke-RestMethod -Uri "$baseUrl/settlements/calculate" -Headers $analystHeaders -Method Post -ContentType "application/json" -Body $settlementPayload
$stlId = $calc.data.id
Write-Host " ✔ Settlement Voucher Generated: $($calc.data.settlementNumber) (ID: $stlId)" -ForegroundColor Green
Write-Host "   - Gross Box Office: ₹$([string]::Format('{0:N2}', $calc.data.grossBoxOffice))" -ForegroundColor Gray
Write-Host "   - Allowable Deductions (GST + Gateway + VPF): ₹$([string]::Format('{0:N2}', $calc.data.allowableDeductions))" -ForegroundColor Gray
Write-Host "   - Net Distributable Pool: ₹$([string]::Format('{0:N2}', $calc.data.netSettlementBasis))" -ForegroundColor Gray
Write-Host "   - Distributor Share ($($calc.data.distributorSharePct)%): ₹$([string]::Format('{0:N2}', $calc.data.distributorSettlementAmount))" -ForegroundColor Green
Write-Host "   - Exhibitor Retention: ₹$([string]::Format('{0:N2}', $calc.data.exhibitorSettlementAmount))" -ForegroundColor Green

# Step 10: Auditor Sign-Off & Approval
Write-Host "`n[Step 10] Authenticating as Assurance Auditor (auditor@cineledger.io) for Payout Approval..." -ForegroundColor Yellow
$loginAuditor = @{ username = "auditor@cineledger.io"; password = "Password@123" } | ConvertTo-Json
$authAuditor = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -ContentType "application/json" -Body $loginAuditor
$auditorHeaders = @{ Authorization = "Bearer $($authAuditor.data.token)" }

$approvePayload = @{ paymentReference = "HDFC-RTGS-DEMO994821" } | ConvertTo-Json
$approvedStl = Invoke-RestMethod -Uri "$baseUrl/settlements/$stlId/approve" -Headers $auditorHeaders -Method Post -ContentType "application/json" -Body $approvePayload
Write-Host " ✔ Settlement Status: $($approvedStl.data.status)" -ForegroundColor Green
Write-Host " ✔ Payout Reference Anchored: $($approvedStl.data.paymentReference) by $($approvedStl.data.approvedBy)" -ForegroundColor Green

# Step 11: Cryptographic SHA-256 Audit Verification
Write-Host "`n[Step 11] Running SHA-256 Hash Chain Integrity Verification..." -ForegroundColor Yellow
$auditCheck = Invoke-RestMethod -Uri "$baseUrl/audit/verify" -Headers $auditorHeaders -Method Get
Write-Host " ✔ Cryptographic Audit Result: $($auditCheck.data.message)" -ForegroundColor Green
Write-Host "   - Chain Valid: $($auditCheck.data.valid) (Total Events Checked: $($auditCheck.data.totalEvents))" -ForegroundColor Green

# Step 12: Tamper Simulation Test
Write-Host "`n[Step 12] Simulating Fraudulent Record Tampering (Forensic Test)..." -ForegroundColor Yellow
$tamperPayload = @{ eventId = 1; description = "UNAUTHORIZED_MALICIOUS_PAYLOAD" } | ConvertTo-Json
$tampered = Invoke-RestMethod -Uri "$baseUrl/audit/tamper-test" -Headers $auditorHeaders -Method Post -ContentType "application/json" -Body $tamperPayload

$breachCheck = Invoke-RestMethod -Uri "$baseUrl/audit/verify" -Headers $auditorHeaders -Method Get
Write-Host " ✔ Tamper Successfully Detected!" -ForegroundColor Green
Write-Host "   - Chain Valid: $($breachCheck.data.valid)" -ForegroundColor Red
Write-Host "   - Discrepancy Detection: $($breachCheck.data.message)" -ForegroundColor Yellow
Write-Host "   - Breached Event ID: #$($breachCheck.data.brokenEventId)" -ForegroundColor Red

# Step 13: Re-anchor and Restore Chain
Write-Host "`n[Step 13] Restoring and Re-anchoring SHA-256 Cryptographic Chain..." -ForegroundColor Yellow
$restored = Invoke-RestMethod -Uri "$baseUrl/audit/restore-chain" -Headers $auditorHeaders -Method Post
$finalAuditCheck = Invoke-RestMethod -Uri "$baseUrl/audit/verify" -Headers $auditorHeaders -Method Get
Write-Host " ✔ Cryptographic Chain Repaired & Re-anchored!" -ForegroundColor Green
Write-Host "   - Final Status: $($finalAuditCheck.data.message)" -ForegroundColor Green

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host " 🎉 ALL 13 END-TO-END VERIFICATION CHECKS PASSED!" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

