import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    // Get the secret from the request
    const searchParams = request.nextUrl.searchParams;
    const secret = searchParams.get("secret");

    // Validate the secret
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json(
        { message: "Invalid revalidation secret" },
        { status: 401 }
      );
    }

    // Get the path to revalidate
    const path = searchParams.get("path") || "/blog";

    // Revalidate the path
    revalidatePath(path);

    return NextResponse.json({
      revalidated: true,
      message: `Path ${path} revalidated successfully`,
    });
  } catch (error) {
    // If there was an error, log it and return an error response
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { message: "Error revalidating", error: String(error) },
      { status: 500 }
    );
  }
}
