import { AxiosError } from "axios";

export const humanError = (error: any): string => {
  const data = error instanceof AxiosError ? error.response?.data : error;

  if (
    data?.["detail"] !== undefined &&
    data?.["detail"] !== null &&
    typeof data["detail"] === "string"
  ) {
    return data["detail"];
  }

  try {
    const values = Object.values(data) as any[][];
    const value = values.find((v) => v.length > 0);

    if (!value || typeof value[0] !== "string") {
      throw new Error();
    }

    return value[0];
  } catch (e) {
    return "Сталася непередбачена помилка";
  }
};
