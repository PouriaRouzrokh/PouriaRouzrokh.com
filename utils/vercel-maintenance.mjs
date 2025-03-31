#!/usr/bin/env node

// Script to toggle maintenance mode for Vercel deployments
import { execSync } from "child_process";
import readline from "readline";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to get the current NEXT_PUBLIC_MAINTENANCE_MODE from Vercel
async function getCurrentMaintenanceMode() {
  try {
    // Get the environment variables from Vercel
    const output = execSync("vercel env ls", { encoding: "utf8" });

    // Check if the maintenance mode variable exists
    const match = output.match(
      /NEXT_PUBLIC_MAINTENANCE_MODE\s+production\s+(true|false)/i
    );
    if (match && match[1]) {
      return match[1].toLowerCase() === "true";
    }

    return false;
  } catch (error) {
    console.error(
      "Error getting environment variables from Vercel:",
      error.message
    );
    return null;
  }
}

// Function to set maintenance mode on Vercel
async function setMaintenanceMode(enabled) {
  try {
    console.log(`Setting maintenance mode to: ${enabled}`);

    // Create a temporary file with the new value
    const tempFilePath = path.join(__dirname, "temp-env-value");
    fs.writeFileSync(tempFilePath, enabled.toString());

    // Update the environment variable on Vercel
    execSync(
      `vercel env rm NEXT_PUBLIC_MAINTENANCE_MODE production -y || true`,
      { stdio: "inherit" }
    );
    execSync(
      `vercel env add NEXT_PUBLIC_MAINTENANCE_MODE production < ${tempFilePath}`,
      { stdio: "inherit" }
    );

    // Clean up temp file
    fs.unlinkSync(tempFilePath);

    console.log(
      `✅ Maintenance mode ${enabled ? "enabled" : "disabled"} on Vercel production environment`
    );
    console.log(`To apply these changes, deploy your site with: vercel --prod`);
  } catch (error) {
    console.error(
      "Error updating environment variable on Vercel:",
      error.message
    );
  }
}

// Main function to toggle maintenance mode
async function toggleMaintenanceMode() {
  const currentMode = await getCurrentMaintenanceMode();

  if (currentMode === null) {
    console.log(
      "Could not determine current maintenance mode. Setting it to enabled..."
    );
    await setMaintenanceMode(true);
    process.exit(0);
  }

  console.log(
    `Current maintenance mode is: ${currentMode ? "ENABLED" : "DISABLED"}`
  );

  rl.question(
    `Do you want to ${currentMode ? "disable" : "enable"} maintenance mode? (y/n) `,
    async (answer) => {
      if (answer.toLowerCase() === "y") {
        await setMaintenanceMode(!currentMode);
      } else {
        console.log("No changes made.");
      }
      rl.close();
    }
  );
}

// Execute the function
toggleMaintenanceMode();
