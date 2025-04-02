#!/usr/bin/env node

// Script to toggle maintenance mode for Vercel deployments
import { execSync } from "child_process";
import readline from "readline";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variable name (server-side only, no NEXT_PUBLIC_ prefix)
const ENV_VAR_NAME = "MAINTENANCE_MODE";

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to get the current maintenance mode status from Vercel
async function getCurrentMaintenanceMode() {
  try {
    console.log("Checking current maintenance mode...");

    // Pull the environment variables to a local file
    const tempEnvFile = path.join(__dirname, ".temp-env");

    // Pull the environment variables from Vercel production
    execSync(`vercel env pull ${tempEnvFile} --environment=production`, {
      encoding: "utf8",
      stdio: "inherit",
    });

    // Read the temporary env file
    if (fs.existsSync(tempEnvFile)) {
      const envContent = fs.readFileSync(tempEnvFile, "utf8");

      // Clean up temp file
      fs.unlinkSync(tempEnvFile);

      // Parse the env file to find the maintenance mode variable
      const lines = envContent.split("\n");
      for (const line of lines) {
        if (line.includes(ENV_VAR_NAME)) {
          const parts = line.split("=");
          if (parts.length >= 2) {
            const value = parts[1].trim().replace(/['"]/g, "");
            return value.toLowerCase() === "true";
          }
        }
      }
    }

    console.log(`Could not find ${ENV_VAR_NAME} in environment variables`);
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
    console.log(
      `Setting maintenance mode to: ${enabled ? "ENABLED" : "DISABLED"}`
    );

    // Create a temporary file with the new value
    const tempFilePath = path.join(__dirname, "temp-env-value");
    const valueToWrite = enabled ? "true" : "false";
    fs.writeFileSync(tempFilePath, valueToWrite);

    // Remove the existing environment variable
    console.log("Removing existing environment variable...");
    try {
      execSync(`vercel env rm ${ENV_VAR_NAME} production -y`, {
        stdio: "inherit",
      });
    } catch {
      // If the variable doesn't exist yet, that's fine
      console.log("Continuing with adding the environment variable...");
    }

    // Add the new environment variable
    console.log("Adding new environment variable...");
    execSync(`vercel env add ${ENV_VAR_NAME} production < ${tempFilePath}`, {
      stdio: "inherit",
    });

    // Clean up temp file
    fs.unlinkSync(tempFilePath);

    console.log(
      `✅ Maintenance mode ${enabled ? "enabled" : "disabled"} successfully on Vercel production environment`
    );
    console.log(
      "\x1b[33m%s\x1b[0m",
      `▶ IMPORTANT: You must run 'vercel --prod' to apply these changes!`
    );
    console.log(
      "\x1b[33m%s\x1b[0m",
      `The API endpoint will only reflect the new status after deployment.`
    );
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
    rl.close();
    return;
  }

  console.log(
    `Current maintenance mode is: ${currentMode ? "ENABLED" : "DISABLED"}`
  );

  rl.question(
    `Do you want to ${currentMode ? "disable" : "enable"} maintenance mode? (y/n) `,
    async (answer) => {
      if (answer.toLowerCase() === "y") {
        await setMaintenanceMode(!currentMode);
        console.log("\nMaintenance mode updated successfully!");
        console.log(
          "\x1b[33m%s\x1b[0m",
          "⚠️ Remember to run 'vercel --prod' to apply these changes!"
        );
      } else {
        console.log("No changes made.");
      }
      rl.close();
    }
  );
}

// Execute the function
toggleMaintenanceMode();
