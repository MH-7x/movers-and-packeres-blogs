"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { headers } from "next/headers";
export default async function CreateCategory(data: {
  name: string;
  description: string;
  imageUrl: string;
  id?: string;
}) {
  const serverSession = await getServerSession(authOptions);
  if (!serverSession) return { success: false, message: "Unauthorized" };
  try {
    const headersList = await headers();
    const cookie = headersList.get("cookie");

    const response = await fetch(`${process.env.PUBLIC_URL}/api/category`, {
      method: data.id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: JSON.stringify({ ...data }),
    });
    if (!response.ok) {
      throw new Error(
        `Failed to ${data.id ? "update" : "create"} category -${
          response.statusText
        }`
      );
    }
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message);
    }
    return {
      message: `${data.id ? "Updated" : "Created"} successfully`,
      success: true,
    };
  } catch (error) {
    console.error(`Failed to ${data.id ? "update" : "create"} category`, error);
    return {
      message:
        error instanceof Error
          ? error.message
          : `Failed to ${data.id ? "update" : "create"} category, server error`,
      success: false,
    };
  }
}
