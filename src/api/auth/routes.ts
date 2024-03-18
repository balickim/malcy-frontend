import { fetchWrapper } from "~/api/fetch";
import { LoginDto } from "~/api/auth/dtos";

export const logIn = async (body: LoginDto): Promise<{ access_token: string }> => {
  return fetchWrapper(`${import.meta.env.VITE_API_URL}/auth/login`, { body: JSON.stringify(body), method: 'POST', credentials: 'include' })
};
