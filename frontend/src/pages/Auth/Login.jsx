import {  useState } from "react";
import {Link ,useLocation,useNavigate} from 'react-router-dom'
import {useSelector,useDispatch} from 'react-redux'
import { useLoginMutation } from '../../redux/apis/userApiSlice'
import { setCredientials } from '../../redux/features/auth/authSlice'
import {toast} from'react-toastify'
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
      dispatch(setCredientials(res.data.user));
      toast.success(res.data.user.username + " sign in");
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
    <section className="pl-[5rem] w-full  overflow-hidden flex justify-between  flex-wrap">
      <div className="mr-[4rem] lg:w-[33%] sm:w-[30rem] mt-[5rem]">
        <h1 className="text-2xl font-bold mb-4">Singin</h1>
        <form onSubmit={handleLogin} className="container w-full ">
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
          <div className="my-[1rem] w-full flex justify-center items-center">
            <button
              className="mt-1 p-2 border rounded font-bold w-full cursor-pointer
              bg-[#0094D4] text-white "
            >
              {isLoading ? <Loader loaderText="Singing In" /> : "Sing In"}
            </button>
          </div>
        </form>
        <div className="mt-4">
          <p>
            New Customer?{" "}
            <Link
              className="text-yellow-500 font-black hover:underline"
              to={redirect ? `/register?redirect=${redirect}` : "/register"}
            >
              Register
            </Link>
          </p>
        </div>
      </div>
      <img
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"
        alt="login image"
        className="h-[100vh]  w-[59%] lg:block  md:hidden sm:hidden   "
      />
    </section>
  );
}
