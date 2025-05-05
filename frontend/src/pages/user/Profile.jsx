import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useProfileMutation,
  useUploadUserImageMutation,
} from "../../redux/apis/userApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { setCredientials } from "../../redux/features/auth/authSlice";
import { prefixImageUrl } from "../../utils/constance";

export default function Profile() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const popuptRef = useRef();

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading }] = useProfileMutation();
  const [uploadUserImage, { isLoading: isLoadingImage }] =
    useUploadUserImageMutation();

  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.username, userInfo.email]);

  useEffect(() => {
    window.document.title = "Profile: " + userInfo.username;
    window.scrollTo(0, 0);
  }, [userInfo]);

  const handleUpates = async (e) => {
    e.preventDefault();
    if (userInfo?.username === username) {
      toast.error("You are already use this Name");
      return;
    }
    if (userInfo?.email === email) {
      toast.error("You are already use this email");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password do not match");
      return;
    }
    const body = { username, password, email };
    if (!username) delete body.username;
    if (!password) delete body.password;
    if (!email) delete body.email;
    try {
      const res = await updateProfile(body).unwrap();
      dispatch(setCredientials(res.data.user));
      toast.success(res.data.user.username + " update his information");
    } catch (err) {
      if (err.status === 404) {
        toast.error(err.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  const updateImageHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(); // Fixed typo: fromData -> formData
    formData.append("img", e.target.files[0]);
    try {
      const res = await uploadUserImage(formData).unwrap();
      dispatch(setCredientials(res.data.user));
      toast.success(res.data.user.username + " update his information");
    } catch (err) {
      if (err.status === 404 || err.status === 400) {
        toast.error(err.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <>
      <div
        className="container mx-auto p-4 pt-6 flex justify-center 
      items-center min-h-[calc(100vh-112px)] md:min-h-screen"
      >
        <div
          className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl 
        shadow-lg py-6 px-4 sm:px-6 rounded-2xl flex flex-col items-center 
        bg-white"
        >
          {/* Profile Image */}
          <div
            className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-37 md:h-37 mb-4 
        cursor-pointer"
          >
            {isLoadingImage ? (
              <div
                className="w-full h-full rounded-full bg-gray-100 flex 
            justify-center items-center"
              >
                <Loader />
              </div>
            ) : (
              <div
                // border-[#00C4B4]
                className="w-full h-full border-5 border-[#00C4B4] rounded-full 
              relative"
              >
                <img
                  src={prefixImageUrl+"user/"+ userInfo?.img?.split("/")?.pop() || prefixImageUrl+"user/userImge.png"}
                  alt={userInfo?.username}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.target.src = prefixImageUrl + "user/userImge.png";
                  }}
                />
                <div
                  className="w-full h-full rounded-full absolute top-0 left-0 
                bg-gradient-to-t from-black to-transparent opacity-0 
                hover:opacity-40 transition-opacity duration-200"
                  onClick={() => popuptRef.current.click()}
                ></div>
              </div>
            )}
            <input
              type="file"
              className="hidden"
              ref={popuptRef}
              accept="image/*"
              onChange={updateImageHandler}
            />
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl   text-gray-800 font-semibold mb-6 text-center">
            Update Profile
          </h2>

          {/* Form */}
          <form onSubmit={handleUpates} className="w-full px-2 sm:px-4">
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 text-sm sm:text-base font-medium italic mb-1"
              >
                User Name
              </label>
              <input
                type="text"
                placeholder="Enter User Name"
                id="username"
                className="w-full p-2 sm:p-3 text-gray-600 border border-gray-300 
              rounded-md focus:border-gray-400 focus:outline-none text-sm sm:text-base"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm sm:text-base font-medium italic mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter Email Address"
                className="w-full p-2 sm:p-3 text-gray-600 border border-gray-300 
              rounded-md focus:border-gray-400 focus:outline-none text-sm sm:text-base"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm sm:text-base font-medium italic mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter Password"
                className="w-full p-2 sm:p-3 text-gray-600 border border-gray-300 
              rounded-md focus:border-gray-400 focus:outline-none text-sm sm:text-base"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 text-sm sm:text-base font-medium italic mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Enter Password Again"
                className="w-full p-2 sm:p-3 text-gray-600 border border-gray-300 
              rounded-md focus:border-gray-400 focus:outline-none text-sm sm:text-base"
                onChange={(e) => setconfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>

            <div className="w-full flex justify-center">
              <button
                type="submit"
                className="w-full  p-2 sm:p-3 bg-gradient-to-r from-[#0094D4] to-[#00C4B4] 
              text-white font-bold rounded-md hover:from-[#0083d4] hover:to-[#00b3a3] 
              focus:outline-none focus:ring-2 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md cursor-pointer focus:ring-blue-400 text-sm sm:text-base"
              >
                {isLoading ? <Loader loaderText="Saving" /> : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
