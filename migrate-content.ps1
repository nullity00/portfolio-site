# PowerShell Migration Script for Jekyll to Next.js
Write-Host "Starting Jekyll to Next.js content migration..." -ForegroundColor Green

# Set the path to your Jekyll site
$JekyllPath = "..\Proxies-website"

# Create necessary directories
Write-Host "Creating directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "content" | Out-Null
New-Item -ItemType Directory -Force -Path "lib" | Out-Null
New-Item -ItemType Directory -Force -Path "app\components" | Out-Null

# Check if Jekyll site exists
if (-not (Test-Path $JekyllPath)) {
    Write-Host "ERROR: Jekyll site not found at $JekyllPath" -ForegroundColor Red
    Write-Host "Please update JekyllPath variable in this script" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "SUCCESS: Found Jekyll site at $JekyllPath" -ForegroundColor Green

# File mapping for renaming
$fileMapping = @{
    "Delegatecall-History.md" = "delegatecall-history.md"
    "Proxies-List.md" = "proxies-list.md" 
    "Proxies-Storage.md" = "proxies-storage.md"
    "Proxies-Table.md" = "proxies-table.md"
    "Proxy-Basics.md" = "proxy-basics.md"
    "Proxy-Identification.md" = "proxy-identification.md"
    "Security-Guide.md" = "security-guide.md"
}

# Copy and rename content files
Write-Host "Copying and renaming content files..." -ForegroundColor Yellow

foreach ($originalFile in $fileMapping.Keys) {
    $sourcePath = Join-Path "$JekyllPath\pages" $originalFile
    $targetFile = $fileMapping[$originalFile]
    $targetPath = Join-Path "content" $targetFile
    
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath $targetPath -Force
        Write-Host "SUCCESS: Copied $originalFile -> $targetFile" -ForegroundColor Green
    } else {
        Write-Host "WARNING: $originalFile not found" -ForegroundColor Yellow
    }
}

# Copy index.md as home page
$indexPath = Join-Path $JekyllPath "index.md"
if (Test-Path $indexPath) {
    Copy-Item $indexPath "content\home.md" -Force
    Write-Host "SUCCESS: Copied index.md -> home.md" -ForegroundColor Green
} else {
    Write-Host "WARNING: index.md not found" -ForegroundColor Yellow
}

# Copy assets
Write-Host "Copying assets..." -ForegroundColor Yellow
$assetsPath = Join-Path $JekyllPath "assets"
if (Test-Path $assetsPath) {
    if (-not (Test-Path "public")) {
        New-Item -ItemType Directory -Path "public" | Out-Null
    }
    Copy-Item "$assetsPath\*" "public\" -Recurse -Force
    Write-Host "SUCCESS: Copied assets to public/" -ForegroundColor Green
} else {
    Write-Host "WARNING: No assets directory found" -ForegroundColor Yellow
}

# Install dependencies
Write-Host "Installing required dependencies..." -ForegroundColor Yellow
try {
    & npm install gray-matter remark remark-html remark-gfm
    Write-Host "SUCCESS: Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Installing dependencies: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Migration completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy the lib/content.js file from the migration guide" -ForegroundColor White
Write-Host "2. Update your app/page.js with the new content loader" -ForegroundColor White
Write-Host "3. Run 'npm run dev' to test the site" -ForegroundColor White
Write-Host ""
Write-Host "Content files in the 'content' directory:" -ForegroundColor Cyan
if (Test-Path "content") {
    Get-ChildItem "content\*.md" | ForEach-Object { Write-Host "   - $($_.Name)" -ForegroundColor White }
} else {
    Write-Host "   No content directory found" -ForegroundColor Yellow
}
Write-Host ""
Read-Host "Press Enter to continue"