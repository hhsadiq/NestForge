import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

const API_URL = process.env.MCP_API_URL;
const API_USERNAME = process.env.MCP_API_USERNAME;
const API_PASSWORD = process.env.MCP_API_PASSWORD;

// Create MCP server
const server = new Server(
  {
    name: 'swagger-api-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

let cachedSpec = null;
let cachedApis = null; // Cache the extracted API details

/**
 * Fetch and cache the OpenAPI spec
 */
async function getOpenApiSpec() {
  if (cachedSpec) return cachedSpec;

  const credentials = Buffer.from(`${API_USERNAME}:${API_PASSWORD}`).toString('base64');
  
  const response = await axios.get(`${API_URL}/docs-json`, {
    headers: {
      'Authorization': `Basic ${credentials}`
    }
  });
  
  cachedSpec = response.data;
  return cachedSpec;
}

/**
 * Find operationId by API name, path, or partial match
 */
function findOperationId(apiIdentifier, apis) {
  if (!apiIdentifier) return null;
  
  const identifier = apiIdentifier.toLowerCase().trim();
  
  // First, try exact operationId match
  const exactMatch = apis.find(api => 
    api.operationId.toLowerCase() === identifier
  );
  if (exactMatch) return exactMatch.operationId;
  
  // Try path match
  const pathMatch = apis.find(api => 
    api.path.toLowerCase().includes(identifier) ||
    identifier.includes(api.path.toLowerCase())
  );
  if (pathMatch) return pathMatch.operationId;
  
  // Try summary/description match
  const summaryMatch = apis.find(api => 
    api.summary.toLowerCase().includes(identifier) ||
    identifier.includes(api.summary.toLowerCase())
  );
  if (summaryMatch) return summaryMatch.operationId;
  
  // Try controller name match (common pattern: ControllerName_method)
  const controllerMatch = apis.find(api => 
    api.operationId.toLowerCase().includes(identifier)
  );
  if (controllerMatch) return controllerMatch.operationId;
  
  // Try partial matches
  const partialMatches = apis.filter(api => 
    api.operationId.toLowerCase().includes(identifier) ||
    api.path.toLowerCase().includes(identifier) ||
    api.summary.toLowerCase().includes(identifier)
  );
  
  if (partialMatches.length === 1) {
    return partialMatches[0].operationId;
  }
  
  return null;
}

// Update the tool definitions to support flexible operationId resolution
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_apis',
        description: 'Return all available APIs from Swagger. Must only be called ONCE per user request. After one call, the client must cache results and never re-call this tool inside the same request or loop.',
        inputSchema: {
          type: 'object',
          properties: {},
        }
      },
      {
        name: 'get_api_details',
        description: 'Get detailed schema information for a specific API operation. Can accept operationId, API path, or descriptive name. The server will resolve to the correct operationId.',
        inputSchema: {
          type: 'object',
          properties: {
            operationId: { 
              type: 'string', 
              description: 'The operation ID, API path, or descriptive name to get details for. Examples: "AuthController_login", "/api/v1/auth/login", "user login api"' 
            }
          },
          required: ['operationId']
        }
      },
      {
        name: 'call_api',
        description: 'Call a specific API endpoint. Can accept operationId, API path, or descriptive name. The server will resolve to the correct operationId.',
        inputSchema: {
          type: 'object',
          properties: {
            operationId: { 
              type: 'string', 
              description: 'The operation ID, API path, or descriptive name to call. Examples: "AuthController_login", "/api/v1/auth/login", "user login api"' 
            },
            parameters: { type: 'object', description: 'Path and query parameters' },
            body: { type: 'object', description: 'Request body for POST/PUT/PATCH requests' },
            headers: { type: 'object', description: 'Request headers (e.g., Authorization)' }
          },
          required: ['operationId']
        }
      },
      {
        name: 'find_operation_id',
        description: 'Find the exact operationId for a given API identifier (path, name, description)',
        inputSchema: {
          type: 'object',
          properties: {
            identifier: { 
              type: 'string', 
              description: 'API path, name, or description to find the operationId for' 
            }
          },
          required: ['identifier']
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    // Ensure we have cached APIs
    if (!cachedApis) {
      const spec = await getOpenApiSpec();
      cachedApis = await extractApiDetails(spec);
    }
    
    if (name === 'list_apis') {
      return {
        content: [{ type: "text", text: JSON.stringify(cachedApis, null, 2) }],
      };
    }
    
    if (name === 'find_operation_id') {
      const { identifier } = args;
      const operationId = findOperationId(identifier, cachedApis);
      
      if (!operationId) {
        return {
          content: [{ type: "text", text: `No operation found for identifier: ${identifier}` }],
          isError: true,
        };
      }
      
      return {
        content: [{ type: "text", text: JSON.stringify({ identifier, operationId }, null, 2) }],
      };
    }
    
    if (name === 'get_api_details' || name === 'call_api') {
      const { operationId: inputIdentifier } = args;
      
      // Resolve the input to actual operationId
      let actualOperationId = findOperationId(inputIdentifier, cachedApis);
      
      if (!actualOperationId) {
        // If not found, try treating it as exact operationId
        const exactMatch = cachedApis.find(api => api.operationId === inputIdentifier);
        if (exactMatch) {
          actualOperationId = inputIdentifier;
        } else {
          return {
            content: [{ type: "text", text: `No API found for identifier: ${inputIdentifier}. Use list_apis first to see available APIs.` }],
            isError: true,
          };
        }
      }
      
      // For get_api_details, get the detailed information
      if (name === 'get_api_details') {
        const spec = await getOpenApiSpec();
        const components = spec.components || {};
        
        // Find the operation
        let targetOp = null;
        let targetPath = null;
        let targetMethod = null;
        
        for (const [path, pathItem] of Object.entries(spec.paths)) {
          for (const [method, op] of Object.entries(pathItem)) {
            if (op.operationId === actualOperationId) {
              targetOp = op;
              targetPath = path;
              targetMethod = method.toUpperCase();
              break;
            }
          }
          if (targetOp) break;
        }
        
        if (!targetOp) {
          return {
            content: [{ type: "text", text: `Operation ${actualOperationId} not found` }],
            isError: true,
          };
        }
        
        // Build detailed API information (your existing code here)
        const apiDetails = {
          operationId: targetOp.operationId,
          method: targetMethod,
          path: targetPath,
          summary: targetOp.summary || targetOp.description || "No description",
          parameters: {
            path: [],
            query: [],
            header: [],
            cookie: []
          },
          requestSchema: null,
          responseSchemas: {}
        };
        
              // Extract parameters
      if (targetOp.parameters) {
        for (const param of targetOp.parameters) {
          const paramDetails = {
            name: param.name,
            in: param.in,
            required: param.required || false,
            description: param.description || "",
            schema: resolveRef(param.schema, components),
            example: param.example
          };
          
          if (param.in === 'path') {
            apiDetails.parameters.path.push(paramDetails);
          } else if (param.in === 'query') {
            apiDetails.parameters.query.push(paramDetails);
          } else if (param.in === 'header') {
            apiDetails.parameters.header.push(paramDetails);
          } else if (param.in === 'cookie') {
            apiDetails.parameters.cookie.push(paramDetails);
          }
        }
      }
      
      // Request schema
      if (targetOp.requestBody?.content?.["application/json"]?.schema) {
        apiDetails.requestSchema = resolveRef(
          targetOp.requestBody.content["application/json"].schema,
          components
        );
      }
      
      // Response schemas
      if (targetOp.responses) {
        for (const [statusCode, response] of Object.entries(targetOp.responses)) {
          if (response.content?.["application/json"]?.schema) {
            apiDetails.responseSchemas[statusCode] = {
              description: response.description || `Response ${statusCode}`,
              schema: resolveRef(
                response.content["application/json"].schema,
                components
              ),
            };
          }
        }
      }
        
        return {
          content: [{ type: "text", text: JSON.stringify(apiDetails, null, 2) }],
        };
      }
      
      // For call_api, proceed with the actual API call
      if (name === 'call_api') {
        const { parameters = {}, body = {}, headers = {} } = args;
        const spec = await getOpenApiSpec();

        // find operation using actualOperationId
        let targetOp = null;
        let targetPath = null;
        let targetMethod = null;
        for (const [path, pathItem] of Object.entries(spec.paths)) {
          for (const [method, op] of Object.entries(pathItem)) {
            if (op.operationId === actualOperationId) {
              targetOp = op;
              targetPath = path;
              targetMethod = method.toUpperCase();
            }
          }
        }

        if (!targetOp) {
          return {
            content: [{ type: "text", text: `Operation ${actualOperationId} not found` }],
            isError: true,
          };
        }

        // build URL and make the call (your existing call_api logic)
        let url = `${API_URL}${targetPath}`;
        for (const [k, v] of Object.entries(parameters)) {
          url = url.replace(`{${k}}`, v);
        }

        const requestHeaders = {
          'Content-Type': 'application/json',
          ...headers
        };
        
        const response = await axios({
          method: targetMethod.toLowerCase(),
          url: url,
          headers: requestHeaders,
          data: ['POST', 'PUT', 'PATCH'].includes(targetMethod) && body ? body : undefined,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ status: response.status, response: response.data }, null, 2),
            },
          ],
        };
      }
    }
    
    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

/**
 * Deep resolve $ref references recursively
 */
function resolveRef(schema, components, visited = new Set()) {
  if (!schema) return null;
  
  if (schema.$ref) {
    const refName = schema.$ref.split("/").pop();
    
    // Prevent infinite recursion
    if (visited.has(refName)) {
      return { $ref: schema.$ref };
    }
    
    visited.add(refName);
    const resolvedSchema = components.schemas?.[refName];
    
    if (resolvedSchema) {
      const resolved = resolveRef(resolvedSchema, components, visited);
      visited.delete(refName);
      return resolved;
    }
    
    visited.delete(refName);
    return schema;
  }
  
  // Handle arrays
  if (schema.type === 'array' && schema.items) {
    return {
      ...schema,
      items: resolveRef(schema.items, components, visited)
    };
  }
  
  // Handle objects with properties
  if (schema.type === 'object' && schema.properties) {
    const resolvedProperties = {};
    for (const [key, value] of Object.entries(schema.properties)) {
      resolvedProperties[key] = resolveRef(value, components, visited);
    }
    return {
      ...schema,
      properties: resolvedProperties
    };
  }
  
  // Handle allOf, oneOf, anyOf
  if (schema.allOf) {
    return {
      ...schema,
      allOf: schema.allOf.map(item => resolveRef(item, components, visited))
    };
  }
  
  if (schema.oneOf) {
    return {
      ...schema,
      oneOf: schema.oneOf.map(item => resolveRef(item, components, visited))
    };
  }
  
  if (schema.anyOf) {
    return {
      ...schema,
      anyOf: schema.anyOf.map(item => resolveRef(item, components, visited))
    };
  }
  
  return schema;
}

/**
 * Extract API details (operationId, path, request/response schemas, parameters)
 */
async function extractApiDetails() {
  const spec = await getOpenApiSpec();
  const components = spec.components || {};
  const apis = [];

  for (const [path, pathItem] of Object.entries(spec.paths)) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!["get", "post", "put", "delete", "patch"].includes(method)) continue;

      const apiDetails = {
        operationId:
          operation.operationId ||
          `${method}_${path.replace(/[^\w]/g, "_")}`,
        method: method.toUpperCase(),
        path,
        summary:
          operation.summary || operation.description || "No description",
        requestSchema: null,
        responseSchemas: {},
        parameters: {
          path: [],
          query: [],
          header: [],
          cookie: []
        }
      };

      // Extract parameters (path, query, header, cookie)
      if (operation.parameters) {
        for (const param of operation.parameters) {
          const paramDetails = {
            name: param.name,
            in: param.in,
            required: param.required || false,
            description: param.description || "",
            schema: resolveRef(param.schema, components),
            example: param.example
          };
          
          if (param.in === 'path') {
            apiDetails.parameters.path.push(paramDetails);
          } else if (param.in === 'query') {
            apiDetails.parameters.query.push(paramDetails);
          } else if (param.in === 'header') {
            apiDetails.parameters.header.push(paramDetails);
          } else if (param.in === 'cookie') {
            apiDetails.parameters.cookie.push(paramDetails);
          }
        }
      }

      // Request schema
      if (operation.requestBody?.content?.["application/json"]?.schema) {
        apiDetails.requestSchema = resolveRef(
          operation.requestBody.content["application/json"].schema,
          components
        );
      }

      // Response schemas
      if (operation.responses) {
        for (const [statusCode, response] of Object.entries(
          operation.responses
        )) {
          if (response.content?.["application/json"]?.schema) {
            apiDetails.responseSchemas[statusCode] = {
              description: response.description || `Response ${statusCode}`,
              schema: resolveRef(
                response.content["application/json"].schema,
                components
              ),
            };
          }
        }
      }

      apis.push(apiDetails);
    }
  }

  return apis;
}

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Swagger API Server running with operationId resolution');
}

main().catch(console.error);