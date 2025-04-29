import {  useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/apis/userApiSlice";
import { setCredientials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import WelcommingLogin from "../../components/WelcommingLogin";

export default function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginFech, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";


  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    if (userInfo?.email === email) {
      toast.success("You are already logged in");
      navigate(redirect);
      return;
    }
    try {
      const res = await loginFech({ password, email }).unwrap();      
      dispatch(setCredientials(res.data.user));
      toast.success(`${res.data.user.username} signed in`);
      navigate(redirect);
    } catch (err) {
      if (err.status === 401) {
        toast.error(err.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <>
      <section
        className="min-h-screen flex flex-col lg:flex-row items-center 
    justify-center bg-gradient-to-br from-white via-cream-50 to-gray-200
    relative overflow-hidden" //  bg-white lg:bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80')]
        //  lg:bg-no-repeat lg:bg-right lg:bg-cover"
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
              Sign In
            </h1>
            <form onSubmit={handleLogin} className="w-full">
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm md:text-base font-medium text-gray-800 italic"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  id="email"
                  className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm md:text-base text-gray-900 focus:border-gray-400 focus:outline-none"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm md:text-base font-medium text-gray-800 italic"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm md:text-base text-gray-900 focus:border-gray-400 focus:outline-none"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full cursor-pointer  p-2 sm:p-3  text-white font-bold rounded-md
                    bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 focus:outline-none 
                shadow-md text-sm md:text-base"
                >
                  {isLoading ? (
                    <Loader
                      loaderText="Signing In"
                      textColor="text-white"
                      loaderColor={"border-white"}
                    />
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>
            <div className="mt-4 text-center lg:text-left">
              <p className="text-sm md:text-base text-gray-600 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-1">
                <span className="font-semibold italic">New Customer?</span>
                <Link
                  className="text-indigo-500 font-bold hover:underline"
                  to={redirect ? `/register?redirect=${redirect}` : "/register"}
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Empty div for background image space on large screens */}
        <div className="hidden lg:block lg:w-1/2">
          <WelcommingLogin />
        </div>
      </section>
    </>
  );
}
