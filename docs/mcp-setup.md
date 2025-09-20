# MCP Server Setup

---

## Table of Contents

- [Overview](#overview)
- [Package Installation](#package-installation)
- [Environment Variables Setup](#environment-variables-setup)
- [Configuration Files](#configuration-files)
  - [`.cursor/mcp.json`](#cursormcpjson)
  - [`scripts/swagger-mcp-server.js`](#scriptsswagger-mcp-serverjs)
- [Available MCP Tools](#available-mcp-tools)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)
- [Sample Queries](#sample-queries)

---

## Overview

The MCP (Model Context Protocol) server provides access to 100+ API endpoints from your swagger APIs through Cursor chat. This setup uses environment variables for secure configuration and automatically handles authentication for deployed APIs while working seamlessly with local development servers.


## Package Installation

The custom MCP server requires the following packages to be installed:

### **Required Packages**
```bash
npm install @modelcontextprotocol/sdk axios dotenv
```

### **Package Details**
- **`@modelcontextprotocol/sdk`** (v1.18.0) - Core MCP SDK for creating Model Context Protocol servers
- **`axios`** (v1.12.2) - HTTP client for making API requests
- **`dotenv`** (v16.4.5) - Loads environment variables from mcp.json

### **Current Status**
✅ **All packages are already installed** in your project's `package.json`

If you're setting up MCP on a new project, ensure these packages are installed before proceeding with the configuration.

## Configuration Files

### `.cursor/mcp.json`

The MCP configuration file defines the server connection (environment variables are read from mcp.json):

```json
{
  "mcpServers": {
    "swagger-api": {
      "command": "node",
      "args": [
        "scripts/swagger-mcp-server.js"
      ],
      "env": {
        "MCP_API_URL": "https://your-api-domain.com",
        "MCP_API_USERNAME": "your_username",
        "MCP_API_PASSWORD": "your_password"
      }
    }
  }
}
```

## Environment Variables Setup

The MCP server reads environment variables. Update the following variables' actual values in mcp.json:

```bash
# MCP Server Configuration
MCP_API_URL=https://your-api-domain.com
MCP_API_USERNAME=your_username
MCP_API_PASSWORD=your_password
```

### **For Local Development**
For local development, update your env section in mcp.json:

```bash
# MCP Server Configuration (Local Development)
MCP_API_URL=http://localhost:3000
MCP_API_USERNAME=
MCP_API_PASSWORD=
```

**Note**: For local development, credentials can be left empty as the local server typically doesn't require authentication.


### `scripts/swagger-mcp-server.js`

The MCP server implementation (`scripts/swagger-mcp-server.js`) provides enhanced functionality including:

- **Enhanced Tools**: Provides three main tools:
  - `list_apis` - Lists all available APIs with complete schemas
  - `get_api_details` - Gets detailed information for specific API operations
  - `call_api` - Executes API calls with authentication

## Available MCP Tools

The MCP server provides **3 main tools** that give access to 100+ API endpoints:

### **1. `mcp_swagger-api_list_apis`**
- **Description**: List all available APIs from the swagger OpenAPI specification
- **Parameters**: None required
- **Returns**: Complete list of all APIs with detailed schemas, request/response structures, and parameters

### **2. `mcp_swagger-api_get_api_details`**
- **Description**: Get detailed schema information for a specific API operation
- **Parameters**: 
  - `operationId` (required) - The operation ID to get details for
- **Returns**: Complete request/response schemas, query parameters, path parameters, and examples

### **3. `mcp_swagger-api_call_api`**
- **Description**: Call a specific API endpoint
- **Parameters**:
  - `operationId` (required) - The operation ID to call
  - `parameters` (optional) - Path and query parameters
  - `body` (optional) - Request body for POST/PUT/PATCH requests
  - `headers` (optional) - Request headers (e.g., Authorization)
- **Returns**: API response data

All tools are prefixed with `mcp_swagger-api_` and can be used directly in Cursor chat.

## Usage

### **Primary Method: Direct MCP Tool Usage (Recommended)**
The MCP server is now properly configured and provides direct access to all API tools in Cursor chat:

1. **Ensure the MCP server is configured** in `.cursor/mcp.json` (already done)
2. **Restart Cursor** to load the MCP configuration
3. **Use MCP tools directly** in Cursor chat with the `mcp_swagger-api_` prefix

**Example Usage:**
```
Get all apis OR List all apis
Get wallet balance API details
Get wallet balance for user ID 123
```
The AI will automatically use `mcp_swagger-api_call_api` with the appropriate parameters.

### **Getting Detailed API Information**
You can ask about specific API details:

```
What are the parameters for wallet transaction history API?
Show me the complete schema for trips creation endpoint
Get details for WalletsController_trxHistory
```


### **Alternative Method: PowerShell Commands**
For advanced users who prefer direct API access:

1. **Use PowerShell commands** from the Sample Queries section below
2. **Access APIs** directly through PowerShell or integrate into your workflow


## Troubleshooting

### MCP Server Connection Issues
If you're unable to connect to the MCP server after completing the setup and restarting Cursor, follow these steps:

1. Press `Ctrl + Shift + P` to open the Command Palette
2. Search for "MCP Settings" and select it
3. Check if the MCP server is disabled in the settings
4. If disabled, enable the MCP server
5. Restart Cursor to apply the changes

### Authentication Issues
If you encounter authentication errors:

1. **Check credentials** in your env section in mcp.json:
   ```bash
   MCP_API_URL=https://your-api-domain.com
   MCP_API_USERNAME=your_username
   MCP_API_PASSWORD=your_password
   ```

2. **Verify API URL** is accessible and correct
3. **Test credentials** using the PowerShell commands in Sample Queries section
4. **For local development**, ensure credentials are empty


## Sample Queries

### Get All MCP Tools
```powershell
$headers = @{"Authorization" = "Basic YOUR_BASE64_AUTH_STRING"}; $response = Invoke-WebRequest -Uri "YOUR_API_URL/docs-json" -Headers $headers; $apiDoc = $response.Content | ConvertFrom-Json; $endpoints = @(); foreach ($path in $apiDoc.paths.PSObject.Properties) { foreach ($method in $path.Value.PSObject.Properties) { if ($method.Name -in @('get', 'post', 'put', 'patch', 'delete')) { $operationId = $method.Value.operationId; $endpoints += $operationId } } }; Write-Host "Available MCP Tools:" -ForegroundColor Cyan; $endpoints | ForEach-Object { Write-Host "• $_" -ForegroundColor White }
```

**Note**: Replace `YOUR_BASE64_AUTH_STRING` with your base64 encoded credentials (username:password) and `YOUR_API_URL` with your actual API URL.

### Get Wallet Tools Only
```powershell
$headers = @{"Authorization" = "Basic YOUR_BASE64_AUTH_STRING"}; $response = Invoke-WebRequest -Uri "YOUR_API_URL/docs-json" -Headers $headers; $apiDoc = $response.Content | ConvertFrom-Json; $walletEndpoints = @(); foreach ($path in $apiDoc.paths.PSObject.Properties) { foreach ($method in $path.Value.PSObject.Properties) { if ($method.Name -in @('get', 'post', 'put', 'patch', 'delete')) { $operationId = $method.Value.operationId; if ($operationId -like "*WalletsController*") { $walletEndpoints += $operationId } } } }; Write-Host "Wallet MCP Tools:" -ForegroundColor Cyan; $walletEndpoints | ForEach-Object { Write-Host "• $_" -ForegroundColor White }
```

### Get Trip Tools Only
```powershell
$headers = @{"Authorization" = "Basic YOUR_BASE64_AUTH_STRING"}; $response = Invoke-WebRequest -Uri "YOUR_API_URL/docs-json" -Headers $headers; $apiDoc = $response.Content | ConvertFrom-Json; $tripEndpoints = @(); foreach ($path in $apiDoc.paths.PSObject.Properties) { foreach ($method in $path.Value.PSObject.Properties) { if ($method.Name -in @('get', 'post', 'put', 'patch', 'delete')) { $operationId = $method.Value.operationId; if ($operationId -like "*TripsController*") { $tripEndpoints += $operationId } } } }; Write-Host "Trip MCP Tools:" -ForegroundColor Cyan; $tripEndpoints | ForEach-Object { Write-Host "• $_" -ForegroundColor White }
```

### Get Specific Tool Details
```powershell
$headers = @{"Authorization" = "Basic YOUR_BASE64_AUTH_STRING"}; $response = Invoke-WebRequest -Uri "YOUR_API_URL/docs-json" -Headers $headers; $apiDoc = $response.Content | ConvertFrom-Json; $targetEndpoint = $null; foreach ($path in $apiDoc.paths.PSObject.Properties) { foreach ($method in $path.Value.PSObject.Properties) { if ($method.Name -in @('get', 'post', 'put', 'patch', 'delete') -and $method.Value.operationId -eq "WalletsController_getBalance") { $targetEndpoint = @{ path = $path.Name; method = $method.Name.ToUpper(); details = $method.Value } } } }; if ($targetEndpoint) { Write-Host "🔍 Wallet Balance Tool Details:" -ForegroundColor Cyan; Write-Host "Method: $($targetEndpoint.method) $($targetEndpoint.path)" -ForegroundColor White; Write-Host "Summary: $($targetEndpoint.details.summary)" -ForegroundColor Gray; Write-Host "Description: $($targetEndpoint.details.description)" -ForegroundColor Gray; Write-Host "`nParameters:" -ForegroundColor Yellow; if ($targetEndpoint.details.parameters) { foreach ($param in $targetEndpoint.details.parameters) { $paramInfo = "• $($param.name) ($($param.in))"; if ($param.required) { $paramInfo += " [REQUIRED]" }; if ($param.schema.type) { $paramInfo += " - Type: $($param.schema.type)" }; Write-Host $paramInfo -ForegroundColor White; if ($param.description) { Write-Host "  $($param.description)" -ForegroundColor Gray } } }; Write-Host "`nResponses:" -ForegroundColor Yellow; if ($targetEndpoint.details.responses) { foreach ($responseCode in $targetEndpoint.details.responses.PSObject.Properties) { $responseInfo = "• $($responseCode.Name)"; if ($responseCode.Value.description) { $responseInfo += " - $($responseCode.Value.description)" }; Write-Host $responseInfo -ForegroundColor White } } } else { Write-Host "Tool not found" -ForegroundColor Red }
```

### Test API Connection
```powershell
$headers = @{"Authorization" = "Basic YOUR_BASE64_AUTH_STRING"}; try { $response = Invoke-WebRequest -Uri "YOUR_API_URL/docs-json" -Headers $headers; Write-Host "✅ API Connection Successful" -ForegroundColor Green; Write-Host "Status: $($response.StatusCode)" -ForegroundColor White } catch { Write-Host "❌ API Connection Failed" -ForegroundColor Red; Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red }
```

---

Previous: [Automatic update of dependencies](automatic-update-dependencies.md)

Next: [Introduction](introduction.md)
