import { useEffect, useState } from "react";

export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const useApi = <T,>(method: Method, endpoint: string, body: BodyInit | null) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      const url = import.meta.env.VITE_BACKEND_URL;

      setIsLoading(true);

      try {
        switch (method) {
          case "GET":
          case "DELETE": {
            const response = await fetch(`${url}/${endpoint}`, {
              method: method,
            });
            const data = await response.json();
            setData(data as T);
            break;
          }
          case "POST":
          case "PUT":
          case "PATCH":
          default: {
            const response = await fetch(`url/${endpoint}`, {
              method: method,
              headers: {
                "content-type": "application/json",
              },
              body: body,
            });
            const data = await response.json();
            setData(data as T);
            break;
          }
        }
      } catch (error) {
        setError((error as Error).message);
      }

      setIsLoading(false);
    };

    getData().then();
  }, [method, endpoint, body]);

  return { data, isLoading, error };
};
