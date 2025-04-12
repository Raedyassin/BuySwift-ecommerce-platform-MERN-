import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../../redux/apis/userApiSlice";
import { setCredientials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

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
      console.log(res);
      
      dispatch(setCredientials(res.data.user));
      toast.success(`${res.data.user.username} signed in`);
      navigate(redirect);
    } catch (err) {
      if (err.status === 401) {
        toast.error(err.data.message);
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <section className="min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-start  bg-white lg:bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1964&q=80')] lg:bg-no-repeat lg:bg-right lg:bg-cover">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center  ">
            Sign In
          </h1>
          <form onSubmit={handleLogin} className="w-full">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm md:text-base font-medium text-gray-600 italic"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm md:text-base text-gray-600 focus:border-gray-400 focus:outline-none"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm md:text-base font-medium text-gray-600 italic"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 w-full p-2 sm:p-3 border border-gray-300 rounded-md text-sm md:text-base text-gray-600 focus:border-gray-400 focus:outline-none"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full cursor-pointer  p-2 sm:p-3 bg-gradient-to-r
              from-[#0094D4] to-[#00C4B4] text-white font-bold rounded-md
              hover:from-[#0083d4] hover:to-[#00b3a3] focus:outline-none 
              focus:ring-2 focus:ring-blue-400 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md text-sm md:text-base"
              >
                {isLoading ? <Loader loaderText="Signing In" /> : "Sign In"}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center lg:text-left">
            <p className="text-sm md:text-base text-gray-600 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-1">
              <span className="font-semibold italic">New Customer?</span>
              <Link
                className="text-purple-500 font-bold hover:underline"
                to={redirect ? `/register?redirect=${redirect}` : "/register"}
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Empty div for background image space on large screens */}
      <div className="hidden lg:block lg:w-1/2"></div>
    </section>
  );
}
