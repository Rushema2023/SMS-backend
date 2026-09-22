export function getErrorResponse(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const details = error as { status?: unknown; message?: unknown };
    return {
      status: typeof details.status === "number" ? details.status : 500,
      message: typeof details.message === "string" ? details.message : "Something went wrong",
    };
  }

  return { status: 500, message: "Something went wrong" };
}