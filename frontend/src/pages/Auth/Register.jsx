import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useCreateUserMutation } from "../../redux/apis/userApiSlice";
import { setCredientials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
export default function Login() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
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
    if (!email || !password ||!username||!confirmPassword) {
      toast.error("Please enter information");
      return;
    }
    if (userInfo?.email === email) {
      toast.success("You are already registered in");
      navigate(redirect);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password do not match");
      return;
    }
    try {
      const res = await createUserFech({ username ,password, email }).unwrap();
      dispatch(setCredientials(res.data.user));
      toast.success(res.data.user.username + " Register");
      navigate(redirect);
    } catch (err) {
      if (err.status === 409) {
        toast.error(err.data.message);
      }
      else if (err.status === 400) {
        toast.error(err.data.message);
      }
      else {
        alert("Something went wrong. Please try again later.");
      }
    }
  };
  return (
    <section className="pl-[5rem] w-full   overflow-hidden flex justify-between  flex-wrap">
      <div className="mr-[4rem] lg:w-[33%] sm:w-[30rem] mt-[5rem]">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <form onSubmit={handleRegister} className="container w-full">
          <div className="my-[1rem]">
            <label htmlFor="username" className="block text-sm font-medium ">
              User Name
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 p-2 border rounded w-full"
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
              {isLoading ? <Loader loaderText="Registering" /> : "Register"}
            </button>
          </div>
        </form>
        <div className="mt-4">
          <p>
            Have arleady an account ?{" "}
            <Link
              className="text-yellow-500 font-black hover:underline"
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
      <img
        src="https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
        // src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
        alt="register image"
        className="h-[100vh]  w-[59%] lg:block  md:hidden sm:hidden   "
      />
    </section>
  );
}
