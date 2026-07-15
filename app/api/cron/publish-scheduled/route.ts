import dbConnect from "@/lib/DBConnect";
import blogsModel from "@/models/blogs.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");

  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();

    const result = await blogsModel.updateMany(
      {
        status: "scheduled",
        scheduledFor: { $lte: new Date() },
      },
      {
        $set: { status: "published" },
      },
    );

    return NextResponse.json({
      success: true,
      message: `Published ${result.modifiedCount} scheduled post(s)`,
      count: result.modifiedCount,
    });
  } catch (error) {
    console.error("Cron publish-scheduled error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to publish scheduled posts",
      },
      { status: 500 },
    );
  }
}
