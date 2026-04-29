"use server";
export default async function CreateCategory(data: {
  name: string;
  description: string;
  imageUrl: string;
  id?: string;
}) {
  try {
    const response = await fetch(`${process.env.PUBLIC_URL}/api/categoy`, {
      method: data.id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
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
