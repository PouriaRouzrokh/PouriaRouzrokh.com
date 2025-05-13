"use server";

/**
 * Utility functions for Google reCAPTCHA Enterprise authentication
 */

/**
 * Verifies a reCAPTCHA token with Google's reCAPTCHA Enterprise API
 * @param token The token returned from the reCAPTCHA client
 * @param action The expected action that was used when generating the token
 * @returns Object containing success status and risk score
 */
export async function verifyRecaptchaToken(token: string, action?: string) {
  try {
    if (!token) {
      console.error("No reCAPTCHA token provided");
      return { success: false, score: 0 };
    }

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    const apiKey = process.env.RECAPTCHA_API_KEY;
    
    if (!siteKey || !apiKey) {
      console.error("reCAPTCHA keys are not configured");
      return { success: false, score: 0 };
    }

    // Create the request body according to the reCAPTCHA Enterprise API format
    const requestBody = {
      event: {
        token: token,
        siteKey: siteKey,
        expectedAction: action
      }
    };

    // The URL for the reCAPTCHA Enterprise API assessment endpoint
    const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.RECAPTCHA_PROJECT_ID}/assessments?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("reCAPTCHA verification API error:", errorData);
      return { success: false, score: 0 };
    }

    const data = await response.json();

    // Check if the assessment was successful
    if (!data.tokenProperties?.valid) {
      console.error("Invalid reCAPTCHA token:", data.tokenProperties?.invalidReason);
      return { success: false, score: 0 };
    }

    // Check if the action matches the expected action
    if (action && data.tokenProperties?.action !== action) {
      console.error(`Action mismatch: expected '${action}', got '${data.tokenProperties?.action}'`);
      return { success: false, score: data.riskAnalysis?.score || 0 };
    }

    // Return success with the risk score
    return { 
      success: true, 
      score: data.riskAnalysis?.score || 0,
      reasons: data.riskAnalysis?.reasons || []
    };
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return { success: false, score: 0 };
  }
}
