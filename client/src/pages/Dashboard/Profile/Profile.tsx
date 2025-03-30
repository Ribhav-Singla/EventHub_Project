import RestPassword from "./Sections/RestPassword";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import Spinner from "../../../components/Spinner/Spinner";
import { Avatar } from "@mui/material";
import { useRecoilValue } from "recoil";
import { authState } from "../../../recoil";
import { stringAvatar } from "../../../utils";
import toast from "react-hot-toast";

interface USER_DATA {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  bio: string;
  linkedIn: string;
  twitter: string;
  newsletter_subscription: boolean;
}

type Inputs = {
  phone: string;
  bio: string;
  linkedIn: string;
  twitter: string;
  newsletter_subscription: boolean;
};

function Profile() {
  const [loading, setLoading] = useState(true);
  const authData = useRecoilValue(authState);
  const [userData, setUserData] = useState<USER_DATA>({
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    bio: "",
    linkedIn: "",
    twitter: "",
    newsletter_subscription: false,
  });
  const [btnLoader, setBtnLoader] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const fetch_data = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/profile/data`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      setUserData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch_data();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setBtnLoader(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/user/profile/data`,
        data,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      await fetch_data();
    } catch (error: unknown) {
      console.error(error);
      toast.error("Something went wrong!");
    } finally {
      setBtnLoader(false);
    }
  };

  if (loading) {
    return (
      <div className="p-5 bg-[#000a26] h-screen flex justify-center items-center min-h-[calc(100vh-72px)]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-5 bg-[#000a26]">
      {/* Profile Header */}
      <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <Avatar
              {...stringAvatar(`${authData.firstname} ${authData.lastname}`)}
              sx={{
                ...stringAvatar(`${authData.firstname} ${authData.lastname}`)
                  .sx,
                height: "50px",
                width: "50px",
              }}
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-white">
              {userData.firstname + userData.lastname}
            </h1>
            <p className="text-gray-300">Attendee</p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg p-6 my-5">
        <h2 className="text-lg font-semibold mb-6 text-white">
          Personal Information
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={userData.firstname}
                disabled
                className="w-full px-4 py-2 border border-neutral-200/20 rounded-lg bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={userData.lastname}
                disabled
                className="w-full px-4 py-2 border border-neutral-200/20 rounded-lg bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={userData.email}
                disabled
                className="w-full px-4 py-2 border border-neutral-200/20 rounded-lg bg-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                className="w-full px-4 py-2 border border-neutral-200/60 rounded-lg outline-none"
                placeholder="8901234567"
                defaultValue={userData.phone}
                {...register("phone", {
                  minLength: {
                    value: 10,
                    message: "Phone number must be exactly 10 digits",
                  },
                  maxLength: {
                    value: 10,
                    message: "Phone number must be exactly 10 digits",
                  },
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message:
                      "Phone number must be numeric and exactly 10 digits",
                  },
                })}
              />
              {errors?.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-2 border border-neutral-200/60 rounded-lg outline-none"
              placeholder="Professional event organizer with over 5 years of experience in planning and executing successful events."
              defaultValue={userData.bio}
              {...register("bio", {
                maxLength: {
                  value: 500,
                  message: "Bio can have maximum 500 charcaters",
                },
              })}
            ></textarea>
            {errors?.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio.message}</p>
            )}
          </div>

          <div className="border-t border-neutral-200/20 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Social Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  LinkedIn
                </label>
                <input
                  type="url"
                  placeholder={`https://linkedin.com/in/${userData.firstname?.toLocaleLowerCase()}`}
                  defaultValue={userData.linkedIn}
                  className="w-full px-4 py-2 border border-neutral-200/60 rounded-lg outline-none"
                  {...register("linkedIn")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Twitter
                </label>
                <input
                  type="url"
                  placeholder={`https://twitter.com/in/${userData.firstname?.toLocaleLowerCase()}`}
                  defaultValue={userData.twitter}
                  className="w-full px-4 py-2 border border-neutral-200/60 rounded-lg outline-none"
                  {...register("twitter")}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200/20 pt-6">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Notifications
            </h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-500 border-neutral-200/20 rounded"
                  {...register("newsletter_subscription")}
                  defaultChecked={userData?.newsletter_subscription}
                />
                <span className="text-sm text-gray-300">
                  Newsletter subscription
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
                btnLoader ? `cursor-not-allowed` : ``
              }`}
            >
              {btnLoader ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>

      <RestPassword />
    </div>
  );
}

export default Profile;
