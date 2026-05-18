$ErrorActionPreference = "Stop"

$root = Join-Path $PSScriptRoot "dist"
$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Parse("127.0.0.1"), 4173)
$listener.Start()

Write-Output "Serving $root at http://127.0.0.1:4173/"

function Get-ContentType([string]$filePath) {
    switch ([System.IO.Path]::GetExtension($filePath).ToLowerInvariant()) {
        ".html" { return "text/html; charset=utf-8" }
        ".js" { return "application/javascript; charset=utf-8" }
        ".css" { return "text/css; charset=utf-8" }
        ".json" { return "application/json; charset=utf-8" }
        ".svg" { return "image/svg+xml" }
        ".png" { return "image/png" }
        ".jpg" { return "image/jpeg" }
        ".jpeg" { return "image/jpeg" }
        ".ico" { return "image/x-icon" }
        default { return "application/octet-stream" }
    }
}

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()

        try {
            $stream = $client.GetStream()
            $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)
            $requestLine = $reader.ReadLine()

            if ([string]::IsNullOrWhiteSpace($requestLine)) {
                continue
            }

            $path = ($requestLine -split ' ')[1]
            while (-not [string]::IsNullOrEmpty($reader.ReadLine())) { }

            $requestPath = [System.Uri]::UnescapeDataString($path.TrimStart('/'))
            if ([string]::IsNullOrWhiteSpace($requestPath)) {
                $requestPath = "index.html"
            }

            $filePath = Join-Path $root $requestPath
            if (-not (Test-Path $filePath -PathType Leaf)) {
                $filePath = Join-Path $root "index.html"
            }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $headers = @(
                "HTTP/1.1 200 OK",
                "Content-Type: $(Get-ContentType $filePath)",
                "Content-Length: $($bytes.Length)",
                "Connection: close",
                ""
                ""
            ) -join "`r`n"

            $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
            $stream.Write($headerBytes, 0, $headerBytes.Length)
            $stream.Write($bytes, 0, $bytes.Length)
            $stream.Flush()
        }
        finally {
            if ($reader) { $reader.Dispose() }
            if ($stream) { $stream.Dispose() }
            $client.Close()
        }
    }
}
finally {
    $listener.Stop()
}
