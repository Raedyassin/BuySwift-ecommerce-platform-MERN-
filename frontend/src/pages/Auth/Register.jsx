import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useCreateUserMutation } from "../../redux/apis/userApiSlice";
import { setCredientials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import WelcommingLogin from "../../components/WelcommingLogin";

export default function Register() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createUserFech, { isLoading }] = useCreateUserMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password || !username || !confirmPassword) {
      toast.error("Please enter all information");
      return;
    }
    if (userInfo?.email === email) {
      toast.success("You are already registered");
      navigate(redirect);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const res = await createUserFech({ username, password, email }).unwrap();
      dispatch(setCredientials(res.data.user));
      toast.success(`${res.data.user.username} registered successfully`);
      navigate('/');
    } catch (err) {
      if (err.status === 409 || err.status === 400) {
        toast.error(err.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <section
      className="min-h-screen flex flex-col lg:flex-row items-center 
    justify-center bg-gradient-to-br from-white via-cream-50 to-gray-200
    relative overflow-hidden"
    >
      {/* Abstract Shapes */}
      <div
        className="absolute top-0 left-0 w-64 h-64 bg-gray-300/50 rounded-full 
      opacity-30 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
      ></div>
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-gray-400/50 
      rounded-full opacity-20 transform translate-x-1/4 translate-y-1/4
      animate-pulse"
      ></div>
      {/* Form Section */}
      <div
        className="w-full lg:w-1/2 flex justify-center items-center p-6 lg:p-12 
      z-10"
      >
        <div
          className="w-full max-w-sm sm:max-w-md bg-cream-50 rounded-2xl 
        shadow-xl p-6 sm:p-8  border border-gray-200 transform transition-all
        duration-300 hover:shadow-2xl"
        >
          <h1
            className="text-indigo-500 mb-6 text-center text-2xl sm:text-3xl 
          font-bold"
          >
            Create an Account
          </h1>
          <form onSubmit={handleRegister} className="w-full">
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm md:text-base font-medium italic 
                text-gray-800"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="mt-1 w-full p-2 sm:p-3 text-sm md:text-base 
                text-gray-900 border border-gray-300 rounded-md 
                focus:border-gray-400 focus:outline-none"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm md:text-base font-medium italic 
                text-gray-800"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                className="mt-1 w-full p-2 sm:p-3 text-sm md:text-base 
                text-gray-900 border border-gray-300 rounded-md 
                focus:border-gray-400 focus:outline-none"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm md:text-base font-medium italic 
                text-gray-800"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 w-full p-2 sm:p-3 text-sm md:text-base 
                text-gray-900 border border-gray-300 rounded-md focus:border-gray-400
                focus:outline-none"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm md:text-base font-medium italic 
                text-gray-800"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 w-full p-2 sm:p-3 text-sm md:text-base 
                text-gray-900 border border-gray-300 rounded-md 
                focus:border-gray-400 focus:outline-none"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full cursor-pointer disabled:bg-gray-400 
                disabled:cursor-not-allowed shadow-md p-2 sm:p-3  text-white font-bold rounded-md 
                bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700
                focus:outline-none  text-sm md:text-base transition-all"
              >
                {isLoading ? (
                  <Loader
                    loaderText="Registering"
                    textColor="text-white"
                    loaderColor={"border-white"}
                  />
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p
              className="text-sm md:text-base text-gray-600 flex flex-col sm:flex-row 
            items-center justify-center gap-1"
            >
              <span className="font-semibold italic">
                Already have an account?
              </span>
              <Link
                className="text-indigo-500 font-bold hover:underline"
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="hidden lg:block lg:w-1/2 z-10">
        <WelcommingLogin />
      </div>
    </section>
  );
}