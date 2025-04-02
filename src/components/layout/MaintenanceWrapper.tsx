"use client";

import { useState, useEffect } from "react";

interface MaintenanceWrapperProps {
  children: React.ReactNode;
}

export default function MaintenanceWrapper({
  children,
}: MaintenanceWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  useEffect(() => {
    // Function to fetch maintenance status
    const checkMaintenanceStatus = async () => {
      try {
        // Add a cache-busting parameter to prevent caching
        const response = await fetch(`/api/config?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setIsMaintenanceMode(data.maintenanceMode);
        }
      } catch (error) {
        console.error("Error checking maintenance mode:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkMaintenanceStatus();

    // Check for maintenance mode every 30 seconds
    const intervalId = setInterval(checkMaintenanceStatus, 30000);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // Show loading spinner while checking status
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Show maintenance page if in maintenance mode
  if (isMaintenanceMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8 text-center">
        <h1 className="text-4xl font-bold mb-6">Coming Soon</h1>
        <p className="text-xl text-muted-foreground max-w-md mb-8">
          This website is currently under maintenance and will be back online
          soon.
        </p>
        <div className="w-24 h-24 border-t-4 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show normal content if not in maintenance mode
  return <>{children}</>;
}
