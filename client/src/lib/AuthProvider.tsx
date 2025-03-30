import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { authState } from "../recoil";
import axios from "axios";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const setAuth = useSetRecoilState(authState);

  useEffect(() => {
    const getData = async () => {
      const token = localStorage.getItem("token") || "";
      if (!token) {
        return;
      }

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/me`,
          {},
          {
            headers: {
              Authorization: `${token}`,
            },
          }
        );
        setAuth({
          id: response.data.id,
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          email: response.data.email,
          avatar: response.data.avatar,
          isAuthenticated: true,
        });
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    getData();

    return () => {
      setAuth({
        id:"",
        firstname: "",
        lastname: "",
        email: "",
        avatar: "",
        isAuthenticated: false,
      });
    };
  }, [setAuth]);

  return <>{children} </>;
};
