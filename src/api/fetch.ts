import { toast } from 'react-hot-toast';

import {getAccessToken} from "~/utils/cookies";

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: HeadersInit;
  body?: BodyInit | null;
}

export async function fetchWrapper(url: string, options?: FetchOptions): Promise<Response | void> {
  try {
    const headers = new Headers(options?.headers ?? {});

    const token = getAccessToken();
    if (token) headers.append('Authorization', `Bearer ${token}`);
    headers.append('Content-Type', 'application/json',)

    const response = await fetch(url, {
      method: options?.method ?? 'GET',
      headers: headers,
      body: options?.body,
    });

    if (response.ok) {
      return response.json()
    } else {
      if (response.status === 401) throw new Error('Error! Not logged in');
      if (response.status === 404) throw new Error('404, Not found');
      if (response.status === 500) throw new Error('500, internal server error');
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('An unexpected error occurred');
    }
  }
}
