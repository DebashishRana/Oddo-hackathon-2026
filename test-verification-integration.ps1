# Test script for verification-ingest endpoint (PowerShell)

$AdminUrl = "http://localhost:3000"
$Endpoint = "$AdminUrl/api/verification-ingest"
$ScannerToken = "sk_scanner_dectra_2025_prod_veriquick_secure_token_v1_a7f8e9d2c3b4a5f6e7d8c9b0a1f2e3d4"

$Headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $ScannerToken"
}

function Test-VerificationEndpoint {
    param(
        [string]$TestName,
        [object]$Payload,
        [switch]$InvalidToken
    )
    
    Write-Host "=== $TestName ===" -ForegroundColor Cyan
    
    $testHeaders = $Headers.Clone()
    if ($InvalidToken) {
        $testHeaders["Authorization"] = "Bearer invalid_token"
    }
    
    try {
        $response = Invoke-WebRequest `
            -Uri $Endpoint `
            -Method POST `
            -Headers $testHeaders `
            -Body ($Payload | ConvertTo-Json) `
            -ContentType "application/json"
        
        Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "Response:" -ForegroundColor Green
        $response.Content | ConvertFrom-Json | ConvertTo-Json | Write-Host
    }
    catch {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.ErrorDetails.Message) {
            Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Red
        }
    }
    Write-Host ""
}

# Test 1: Valid verification event (Aadhaar - Verified)
Test-VerificationEndpoint -TestName "Test 1: Valid Verification Event (Aadhaar - Verified)" -Payload @{
    document_type = "Aadhaar"
    user_name = "John Doe"
    user_email = "john@example.com"
    confidence = 0.92
    image_url = "https://example.blob.core.windows.net/document.jpg"
    document_id = "DOC-12345"
    scanner_version = "2.3.0"
}

# Test 2: Low Confidence (Flagged)
Test-VerificationEndpoint -TestName "Test 2: Low Confidence (Flagged)" -Payload @{
    document_type = "PAN"
    user_name = "Jane Smith"
    user_email = "jane@example.com"
    confidence = 0.45
    image_url = "https://example.blob.core.windows.net/pan.jpg"
    document_id = "DOC-12346"
}

# Test 3: Medium Confidence (Pending)
Test-VerificationEndpoint -TestName "Test 3: Medium Confidence (Pending)" -Payload @{
    document_type = "Passport"
    user_name = "Bob Johnson"
    user_email = "bob@example.com"
    confidence = 0.72
    image_url = "https://example.blob.core.windows.net/passport.jpg"
    document_id = "DOC-12347"
}

# Test 4: Missing Required Field (Error)
Test-VerificationEndpoint -TestName "Test 4: Missing Required Field (Error)" -Payload @{
    document_type = "Passport"
    user_email = "test@example.com"
}

# Test 5: Invalid Bearer Token
Test-VerificationEndpoint -TestName "Test 5: Invalid Bearer Token" -InvalidToken -Payload @{
    document_type = "Aadhaar"
    user_name = "Test User"
    confidence = 0.88
    image_url = "https://example.blob.core.windows.net/test.jpg"
}

# Test 6: Get Logs
Write-Host "=== Test 6: Get Logs ===" -ForegroundColor Cyan
try {
    $logsResponse = Invoke-WebRequest `
        -Uri "$AdminUrl/api/logs?limit=10" `
        -Method GET
    
    Write-Host "Status: $($logsResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $logsData = $logsResponse.Content | ConvertFrom-Json
    Write-Host "Total logs: $($logsData.stats.total)" -ForegroundColor Green
    Write-Host "Verified: $($logsData.stats.verified) | Flagged: $($logsData.stats.flagged) | Pending: $($logsData.stats.pending)" -ForegroundColor Green
    
    if ($logsData.logs.Count -gt 0) {
        Write-Host "Latest events:" -ForegroundColor Green
        $logsData.logs | Select-Object -First 3 | ForEach-Object {
            Write-Host "  - $(($_.metadata.user_name)): $($_.metadata.status) (confidence: $($_.metadata.confidence))"
        }
    }
}
catch {
    Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nAll tests completed!" -ForegroundColor Cyan
