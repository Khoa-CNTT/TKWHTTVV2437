import apiUser from "@/api/user";
import { jwtDecode } from "jwt-decode";

type CustomOptions = RequestInit & {
  baseUrl?: string | undefined;
};

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined | any
) => {
  try {
    const body = options?.body ? JSON.stringify(options.body) : undefined;

    const baseHeaders = {
      "Content-Type": "application/json",
    };

    const baseUrl = options?.baseUrl ?? process.env.NEXT_PUBLIC_URL_SERVER_API;
    const fullUrl = url.startsWith("/")
      ? `${baseUrl}${url}`
      : `${baseUrl}/${url}`;

    /// refresh token chua xử lí
    // if (options?.headers?.token) {
    //   const token = options?.headers?.token.split(" ")[1];
    //   const decoded: any = jwtDecode(token);
    //   const now = new Date();

    //   if (decoded.exp < now.getTime() / 1000 + 30) {
    //     if (typeof window !== "undefined") {
    //       const reponse: any = await apiUser.refreshToken();
    //       if (reponse?.status === "OK" && reponse?.message === "SUCCESS") {
    //         localStorage.setItem("access_token", reponse?.access_token);

    //         const response = await fetch(fullUrl, {
    //           ...options,
    //           headers: {
    //             ...baseHeaders,
    //             token: `Bearer ${reponse.access_token}`,
    //           },
    //           body,
    //           method,
    //           cache: "no-cache",
    //         });
    //       }
    //     }
    //   } else {
    //     console.log("refress token cx het han");
    //   }
    // }
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...baseHeaders,
        ...options?.headers,
      },
      body,
      method,
      cache: "no-cache",
    });
    const payload = await response.json();
    return payload;
  } catch (error) {
    console.log("HTTP Request Error:", error);
  }
};

const http = {
  get<Response>(url: string, options?: Omit<CustomOptions, "body">) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body">
  ) {
    return request<Response>("POST", url, {
      ...options,
      body,
    });
  },
  put<Response>(url: string, body: any, options?: Omit<CustomOptions, "body">) {
    return request<Response>("PUT", url, {
      ...options,
      body,
    });
  },
  delete<Response>(url: string, options?: Omit<CustomOptions, "body">) {
    return request<Response>("DELETE", url, options);
  },
};

export default http;
