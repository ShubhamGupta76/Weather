# Jenkins Build Trigger Script
$jenkinsUrl = "http://localhost:8087"
$jobName = "weather-frontend-pipeline"

Write-Host "Triggering Jenkins build for: $jobName" -ForegroundColor Cyan

try {
    Write-Host "Getting Jenkins CSRF token..." -ForegroundColor Yellow
    $crumbResponse = Invoke-RestMethod -Uri "$jenkinsUrl/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,':',//crumb)" -Method GET -UseBasicParsing
    
    $crumb = $crumbResponse -split ":" | Select-Object -Last 1
    $crumbField = $crumbResponse -split ":" | Select-Object -First 1
    
    Write-Host "Got CSRF token" -ForegroundColor Green
    
    Write-Host "Triggering build..." -ForegroundColor Yellow
    $headers = @{
        $crumbField = $crumb
    }
    
    $response = Invoke-WebRequest -Uri "$jenkinsUrl/job/$jobName/build" -Method POST -Headers $headers -UseBasicParsing
    
    if ($response.StatusCode -eq 201 -or $response.StatusCode -eq 200) {
        Write-Host "Build triggered successfully!" -ForegroundColor Green
        Write-Host "View build status at: $jenkinsUrl/job/$jobName" -ForegroundColor Cyan
    } else {
        Write-Host "Unexpected response: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error triggering build:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: Open Jenkins in browser and click Build Now button" -ForegroundColor Yellow
    Write-Host "URL: $jenkinsUrl/job/$jobName" -ForegroundColor Cyan
}
