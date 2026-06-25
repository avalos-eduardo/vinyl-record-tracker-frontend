import toast from "react-hot-toast";

export class ToastedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ToastedError";
  }
}

export async function handleApiError(res: Response): Promise<never> {
  const err = await res.json().catch(() => ({}));
  const message = err.error || "Something went wrong.";
  toast.error(message);
  throw new ToastedError(message);
}
