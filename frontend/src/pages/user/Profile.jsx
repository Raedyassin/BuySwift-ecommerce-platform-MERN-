import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useProfileMutation } from "../../redux/apis/userApiSlice";
import { toast } from "react-toastify"
import Loader from "../../components/Loader"
import { setCredientials } from "../../redux/features/auth/authSlice"
export default function Profile() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading }] = useProfileMutation();
  useEffect(() => {
    setUsername(userInfo.username);
    setEmail(userInfo.email);
  }, [userInfo.username, userInfo.email]);

    const handleUpates = async (e) => {
      e.preventDefault();
      if (userInfo?.email === email) {
        toast.error("You are already use this email");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Password do not match");
        return;
      }
      const body = { username, password, email };
      if(!username) delete body.username
      if (!password) delete body.password;
      if (!email) delete body.email;
      try {
        const res = await updateProfile(body).unwrap();
        console.log(res)
        dispatch(setCredientials(res.data.user));
        toast.success(res.data.user.username + " update his information");
      } catch (err) {
        if (err.status === 404) {
          toast.error(err.data.message);
        } else {
          alert("Something went wrong. Please try again later.");
        }
      }
    };

  return (
    <div className="container flex justify-center items-center w-full p-4 pt-[5rem]">
      <div className="flex w-full  justify-center items-center flex-col align-center md:flex md:space-x-4">
        <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
        <form onSubmit={handleUpates} className="lg:w-[30rem] sm:w-[20rem]">
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2 font-medium ">
              User Name
            </label>
            <input
              type="text"
              id="username"
              className=" form-input p-2 border rounded-sm w-full"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>
          <div className="my-[1rem]">
            <label htmlFor="email" className="block text-sm font-medium ">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 border rounded w-full"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="my-[1rem]">
            <label htmlFor="password" className="block text-sm font-medium ">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className="my-[1rem]">
            <label htmlFor="password" className="block text-sm font-medium ">
              Confirm Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full"
              onChange={(e) => setconfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </div>
          <div className="my-[1rem] w-full flex justify-center items-center">
            <button
              className="mt-1 p-2 border rounded font-bold w-full cursor-pointer
              bg-[#0094D4] text-white flex justify-center items-center"
            >
              {isLoading ? <Loader loaderText="Saving" /> : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
