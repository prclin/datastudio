import type { Response } from "@models/common";
import { Toast } from "@douyinfe/semi-ui";
import axios, {
  AxiosInstance,
  AxiosResponse,
  HttpStatusCode,
  Method,
} from "axios";
import { MutationOptions, useMutation } from "@tanstack/react-query";

const onFullFilled = (
  response: AxiosResponse<Response<unknown>>,
): AxiosResponse<Response<unknown>> => {
  const { data } = response;
  if (data.code !== HttpStatusCode.Ok.valueOf()) {
    Toast.warning({ content: data.message, duration: 3 });
  }
  return response;
};
const onRejected = (error: { message: string }): Response<unknown> => {
  Toast.error({ content: error.message, duration: 4 });
  return {
    code: 404,
    message: error.message,
    data: null,
  } as unknown as Response<null>;
};

export const newAxios = (base: string, url: string = ""): AxiosInstance => {
  const instance = axios.create({
    baseURL: base + url,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  instance.interceptors.response.use(onFullFilled, onRejected);
  return instance;
};

export const newMutation = <V, R>(
  server: AxiosInstance,
  method: Extract<Method, "POST" | "PUT" | "DELETE">,
  url: string,
  isForm: boolean = false,
) => {
  return (
    options?: MutationOptions<AxiosResponse<Response<R>>, unknown, V>,
  ) => {
    return useMutation({
      mutationFn: (data: V) => {
        const formData = new FormData();
        if (isForm && data instanceof Object) {
          Object.entries(data).forEach(([key, value]) => {
            if (Array.isArray(value) && value.every(v => v instanceof File))
              value.forEach(f => formData.append(key, f, f.name));
            else if (value !== undefined)
              formData.append(
                key,
                typeof value === "string" ? value : JSON.stringify(value),
              );
          });
        }
        switch (method) {
          case "PUT":
            return isForm
              ? server.putForm<Response<R>>(url, formData)
              : server.put<Response<R>>(url, data);
          case "POST":
            return isForm
              ? server.postForm<Response<R>>(url, formData)
              : server.post<Response<R>>(url, data);
          case "DELETE":
            return server.delete<Response<R>>(url, {
              data: isForm ? formData : data,
            });
        }
      },
      ...options,
    });
  };
};
