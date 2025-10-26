param(
  [int]$Port = 8002
)

$P = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location (Join-Path $P "..\server")

# set env for this process
$env:PORT = $Port
$env:NODE_ENV = "development"

Write-Output "Starting server in demo mode on port $Port..."

# Start in background and write pid to server.pid
$proc = Start-Process -FilePath 'npm' -ArgumentList 'run','start' -WorkingDirectory (Get-Location) -PassThru -WindowStyle Hidden
$proc.Id | Out-File -FilePath (Join-Path (Get-Location) 'server.pid') -Encoding ascii

Write-Output "Server started (PID: $($proc.Id)). PID written to server/server.pid"
Pop-Location
