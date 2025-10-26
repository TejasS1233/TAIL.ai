$P = Split-Path -Parent $MyInvocation.MyCommand.Path
$pidFile = Join-Path $P "..\server\server.pid"

if (Test-Path $pidFile) {
  $pid = Get-Content $pidFile | Select-Object -First 1
  try {
    Stop-Process -Id $pid -Force -ErrorAction Stop
    Write-Output "Stopped server (PID $pid)"
  } catch {
    Write-Output "Failed to stop PID $pid (process may have exited). Removing pid file."
  }
  Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
} else {
  Write-Output "No server.pid found at $pidFile. Server may not be running or pid file was removed."
}
