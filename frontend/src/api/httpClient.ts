const BASE_URL = 'http://localhost:5010/api';

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) {
    return Promise.resolve({} as T);
  }
  return response.json();
};

export const httpClient = {
  get: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`);
    return handleResponse<T>(response);
  },
  post: async <T, U>(url: string, data: U): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },
  put: async <T, U>(url: string, data: U): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },
  delete: async <T>(url: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: 'DELETE',
    });
    return handleResponse<T>(response);
  },
};
