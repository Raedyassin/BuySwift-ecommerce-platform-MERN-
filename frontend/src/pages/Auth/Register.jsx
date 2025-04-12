import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useCreateUserMutation } from "../../redux/apis/userApiSlice";
import { setCredientials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";

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
      navigate(redirect);
    } catch (err) {
      if (err.status === 409 || err.status === 400) {
        toast.error(err.data.message);
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <section className="min-h-screen flex flex-col lg:flex-row items-center justify-center lg:justify-start bg-white lg:bg-[url('https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2065&q=80')] lg:bg-no-repeat lg:bg-right lg:bg-cover">
      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-center ">
            Register
          </h1>
          <form onSubmit={handleRegister} className="w-full">
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm md:text-base font-medium italic text-gray-600"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                className="mt-1 w-full p-2 sm:p-3 text-sm md:text-base text-gray-600 border border-gray-300 rounded-md focus:border-gray-400 focus:outline-none"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm md:text-base font-medium italic text-gray-600"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                className="mt-1 w-full p-2 sm:p-3 text-sm md:text-base text-gray-600 border border-gray-300 rounded-md focus:border-gray-400 focus:outline-none"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm md:text-base font-medium italic text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 w-full p-2 sm:p-3 text-sm md:text-base text-gray-600 border border-gray-300 rounded-md focus:border-gray-400 focus:outline-none"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm md:text-base font-medium italic text-gray-600"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 w-full p-2 sm:p-3 text-sm md:text-base text-gray-600 border border-gray-300 rounded-md focus:border-gray-400 focus:outline-none"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md  p-2 sm:p-3 bg-gradient-to-r from-[#0094D4] to-[#00C4B4] text-white font-bold rounded-md hover:from-[#0083d4] hover:to-[#00b3a3] focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
              >
                {isLoading ? <Loader loaderText="Registering" /> : "Register"}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center lg:text-left">
            <p className="text-sm md:text-base text-gray-600 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-1">
              <span className="font-semibold italic">
                Already have an account?
              </span>
              <Link
                className="text-purple-500 font-bold hover:underline"
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
              >
                Login
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
