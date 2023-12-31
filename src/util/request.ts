const { PLOT_SERVER } = import.meta.env;

const BASE_URL = `${PLOT_SERVER as string}`;

interface requestParams {
  url: string;
  method: string;
  body?: unknown;
}

export interface ResponseType<T> {
  data: T;
  status: string;
  code: number;
  message: string;
}

export interface ErrorType {
  timestamp: string;
  status: number;
  error: string;
  path: string;
}

const getConfig = (method: string, body?: unknown) => {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  } as RequestInit;
};

export const fetchRequest = async <T>({
  url,
  method,
  body,
}: requestParams): Promise<T> => {
  if (!navigator.onLine) {
    throw new Error('NETWORK_NOT_AVAILABLE');
  }

  const response = await fetch(`${BASE_URL}${url}`, getConfig(method, body));

  const data = (await response.json()) as ResponseType<T> | ErrorType;

  if (data instanceof Error) {
    throw new Error(`${data?.name}: ${data?.message}`);
  }

  if (!response.ok) {
    throw data;
  }

  if (data.status === 'OK') {
    return (data as ResponseType<T>).data;
  } else {
    throw data;
  }
};
