import { NextResponse } from "next/server";

/**
 * API endpoint to check if the website is in maintenance mode
 * This endpoint allows the maintenance mode to be toggled without redeploying
 */
export async function GET() {
  // Get maintenance mode from server-side environment variable
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";

  // Return the current config with CORS headers
  return NextResponse.json(
    {
      maintenanceMode,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
