import { ILoginDto } from "~/api/auth/dtos";
import { fetchWrapper } from "~/api/fetch";

export const logIn = async (
  body: ILoginDto,
): Promise<{ access_token: string }> => {
  return fetchWrapper(`${import.meta.env.VITE_API_URL}/auth/login`, {
    body: JSON.stringify(body),
    method: "POST",
    credentials: "include",
  });
};
