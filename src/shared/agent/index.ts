import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useParams, useNavigate } from "react-router-dom";

const useApi = () => {
  let navigate = useNavigate();
  const [token, setLocalToken] = useState<string>("");

  const [client] = useState(() => {
    console.log("#############");
    const client = axios.create({
      baseURL: process.env.REACT_APP_MANAGEMENT_URL,
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${localStorage.getItem("management_token")}`,
      },
      withCredentials: true,
    });

    return client;
  });

  useEffect(() => {
    const interceptor = client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized");
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      client.interceptors.response.eject(interceptor);
    };
  }, [client]);

  const setToken = (token: string) => {
    axios.defaults.headers["Authorization"] = `Bearer ${token}`;
  };

  const get = async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    const response = await client.get<T>(url, config);
    return response;
  };

  const post = async <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    const response = await client.post<T>(url, data, config);
    return response;
  };

  const del = async <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> => {
    const response = await client.delete<T>(url, config);
    return response;
  };

  return { get, post, del, setToken };
};

export default useApi;
