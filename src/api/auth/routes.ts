import { ILoginDto, IRegisterDto } from "~/api/auth/dtos";
import { fetchWrapper } from "~/api/fetch";
import { IUser } from "~/types/user";

export const logIn = async (
  body: ILoginDto,
): Promise<{ access_token: string; user: IUser }> => {
  return fetchWrapper(`${import.meta.env.VITE_API_URL}/auth/login`, {
    body: JSON.stringify(body),
    method: "POST",
    credentials: "include",
  });
};

export const register = async (
  body: IRegisterDto,
): Promise<{ access_token: string; user: IUser }> => {
  return fetchWrapper(`${import.meta.env.VITE_API_URL}/auth/register`, {
    body: JSON.stringify(body),
    method: "POST",
    credentials: "include",
  });
};
