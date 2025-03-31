// For scripts in Node.js, CommonJS imports are still typical
// This file is not part of the Next.js application, so we can use require()
// eslint-disable-next-line
const fs = require("fs");
// eslint-disable-next-line
const path = require("path");

// Path to the .env.local file
const envPath = path.join(__dirname, "..", ".env.local");

// Function to read the current maintenance mode status
function getCurrentMaintenanceMode() {
  try {
    const envFile = fs.readFileSync(envPath, "utf8");
    const match = envFile.match(/NEXT_PUBLIC_MAINTENANCE_MODE=(true|false)/);
    if (match && match[1]) {
      return match[1] === "true";
    }
    return false;
  } catch (error) {
    console.error("Error reading .env.local file:", error.message);
    return false;
  }
}

// Function to toggle maintenance mode
function toggleMaintenanceMode() {
  try {
    const isMaintenanceMode = getCurrentMaintenanceMode();
    const newMode = !isMaintenanceMode;

    // Read the current .env.local content
    let envContent = fs.readFileSync(envPath, "utf8");

    // Replace the maintenance mode line
    envContent = envContent.replace(
      /NEXT_PUBLIC_MAINTENANCE_MODE=(true|false)/,
      `NEXT_PUBLIC_MAINTENANCE_MODE=${newMode}`
    );

    // Write the updated content back to the file
    fs.writeFileSync(envPath, envContent);

    console.log(`✅ Maintenance mode ${newMode ? "enabled" : "disabled"}`);
    console.log(`To see the changes, restart your Next.js development server.`);
  } catch (error) {
    console.error("Error updating .env.local file:", error.message);
  }
}

// Execute the function
toggleMaintenanceMode();
