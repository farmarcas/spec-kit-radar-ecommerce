// Preload for the mongodb-mcp-server subprocess (see .mcp.json).
// Node's default DNS resolver in this environment is 127.0.0.1, which refuses
// SRV queries needed for mongodb+srv:// connection strings (ECONNREFUSED).
// The OS resolver (172.30.0.2, AWS VPC internal DNS) answers them fine, so we
// point Node's resolver at it before the MCP server starts.
require('dns').setServers(['172.30.0.2']);
