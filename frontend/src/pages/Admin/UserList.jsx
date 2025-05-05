import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import {
  useGetAllUsersByAdminQuery,
  useDeleteUserByAdminMutation,
  useUserUpdateDetailsByAdminMutation,
  useMakeAsAdminMutation,
} from "../../redux/apis/userApiSlice";
import { motion } from "motion/react";
import Message from "../../components/Message";
import AdminMenu from "./AdminMenu";
import PageLoader from "../../components/PageLoader";
import PageHeader from "../../components/PageHeader";
import PageSlider from "../../components/PageSlider";
import { FaDeleteLeft } from "react-icons/fa6";
import { CiFilter, CiSearch } from "react-icons/ci";
export default function UserList() {
  const [searchBy, setSearchBy] = useState("id");
  const [searchValue, setSearchValue] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [finalFilterBy, setFinalFilterBy] = useState({
    id: "",
    name: "",
    email: "",
  });
  const [filterSet, setFilterSet] = useState({
    createdAt: "",
    isAdmin: "",
  });

  const [page, setPage] = useState(1);
  const [pagesCount, setPagesCount] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectUserForAdmin, setSelectUserForAdmin] = useState(null);
  const [makeAsAdmin, { isLoading: isLoadingMakeAsAdmin }] =
    useMakeAsAdminMutation();
  const {
    data: users,
    refetch,
    isFetching,
    error,
    isLoading,
  } = useGetAllUsersByAdminQuery({
    page,
    limit: 50,
    ...filterSet,
    ...finalFilterBy,
  });

  const [deleteUser] = useDeleteUserByAdminMutation();
  const [updateUser] = useUserUpdateDetailsByAdminMutation();

  const [editableuserId, setEditableUserId] = useState(null);
  const [editableName, setEditableName] = useState("");
  const [editableEmail, setEditableEmail] = useState("");
  const [userDateBeforUpdate, setUserDateBeforUpdate] = useState({});

  useEffect(() => {
    if (
      users &&
      users.usersLength !== undefined &&
      users.pageSize !== undefined
    ) {
      setPagesCount(Math.ceil(users?.usersLength / users?.pageSize));
    }
  }, [users]);
  const deleteHandler = async (id) => {
    if (!window.confirm("Are you Sure?")) {
      return;
    }
    try {
      await deleteUser(id).unwrap();
      toast.success("user with " + id + " is deleted");
      refetch();
    } catch (err) {
      if (err.status === 404) {
        toast.error(err.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };
  const toggleEdite = (id, username, email) => {
    setEditableUserId(id);
    setEditableName(username);
    setEditableEmail(email);
    setUserDateBeforUpdate({ username, email });
  };
  const updateHandler = async (id, username, email) => {
    if (editableuserId === null) {
      return toggleEdite(id, username, email);
    }
    const body = { email: editableEmail, username: editableName };
    if (body.email === userDateBeforUpdate.email) delete body.email;
    if (body.username === userDateBeforUpdate.username) delete body.username;
    if (!body.email && !body.username) {
      setEditableUserId(null);
      return;
    }
    try {
      await updateUser({ id, body }).unwrap();
      toast.success("user with " + id + " is updated");
      setEditableUserId(null);
      refetch();
    } catch (err) {
      if (err.status === 400) {
        toast.error(err.data.message);
      } else if (err.status === 404) {
        toast.error(err.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };
  const makeAdminHandler = async (id) => {
    setSelectUserForAdmin(id);
    try {
      await makeAsAdmin(id).unwrap();
      toast.success("user with " + id + " is Admin now");
      refetch();
    } catch (err) {
      if (err.status === 400) {
        toast.error(err.data.message);
      } else if (err.status === 404) {
        toast.error(err.data.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };
  const slectedUserHandler = (userId) => {
    if (selectedUser === userId) return setSelectedUser(null);
    setSelectedUser(userId);
  };

  const searchByHandler = () => {
    if (!searchValue) return toast.error("Search value is required");
    setFilterSet({
      createdAt: "",
      isAdmin: "",
    });
    if (searchBy === "id") setFinalFilterBy({ id: searchValue });
    else if (searchBy === "name") setFinalFilterBy({ name: searchValue });
    else if (searchBy === "email") setFinalFilterBy({ email: searchValue });
  };
  const inputSearchHandler = (e) => {
    if (e.key === "Enter")  searchByHandler();
  }
  useEffect(() => {
    window.document.title = "User Table";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (filterBy === "all") {
      setFilterSet({
        createdAt: "",
        isAdmin: "",
      });
      setFinalFilterBy({
        id: "",
        name: "",
        email: "",
      });
    }
  }, [filterBy]);

  useEffect(() => {
    if (error && error?.status < 500) {
      toast.error(error?.data?.data?.title || error?.data?.message);
    }
  }, [error]);
  if (isLoading) return <PageLoader />;
  if (error && error.status >= 500) {
    return (
      <Message variant="danger">
        {error?.data?.data?.title || error?.data?.message}
      </Message>
    );
  }
  return (
    <div className="mx-[1rem] sm:mx-[2rem] pt-[2rem]">
      <AdminMenu />
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <PageHeader>Users List ({users?.usersLength})</PageHeader>
      </motion.div>
      {/* filter */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="flex items-center mt-6 mb-3  flex-wrap justify-between">
          <div
            className="flex items-center mt-2 order-2 lg:order-1 border-2 border-gray-100 rounded-2xl 
                  p-1 focus-within:border-gray-200 text-sm sm:text-base"
          >
            <CiFilter className=" text-gray-500 w-7 h-7  " />
            <select
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-[8rem] mr-3 p-2 focus:outline-none placeholder:italic rounded-xl "
              defaultValue={"all"}
            >
              <option value="all">All</option>
              <option value="createdAt">Date</option>
              <option value="isAdmin">Is Admin</option>
            </select>
            {filterBy !== "all" && filterBy !== "" && (
              <div className="h-5 w-[1px] bg-gray-300"></div>
            )}
            {filterBy === "createdAt" && (
              <input
                onChange={(e) =>
                  setFilterSet({ ...filterSet, createdAt: e.target.value })
                }
                value={
                  filterSet.createdAt || new Date().toISOString().split("T")[0]
                }
                min={"2025-02-05"}
                type="date"
                className="w-[15rem] p-2 focus:outline-none placeholder:italic 
                      rounded-xl "
              />
            )}
            {filterBy === "isAdmin" && (
              <select
                onChange={(e) =>
                  setFilterSet({ ...filterSet, isAdmin: e.target.value })
                }
                className="w-[8rem] p-2 focus:outline-none placeholder:italic rounded-xl "
                defaultValue={""}
              >
                {/* ["pending", "delivered", 'ontheroute',"packed", "cancelled"] */}
                <option value="">All</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            )}
          </div>
          {/*  */}
          <div
            className="border-2 mt-2 w-full justify-around lg:w-[30rem] lg:order-2 
          order-1 border-gray-100 rounded-2xl p-1 focus-within:border-gray-200 flex
          items-center gap-2 text-sm sm:text-base"
          >
            <select
              className="w-[8rem] p-2  focus:outline-none placeholder:italic 
              rounded-xl  "
              onChange={(e) => setSearchBy(e.target.value)}
            >
              <option value="id"> Id</option>
              <option value="name"> Name</option>
              <option value="email"> Email</option>
            </select>
            <div className="h-5 w-[1px] bg-gray-300"></div>

            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => inputSearchHandler(e)}
              placeholder={
                searchBy === "id"
                  ? "Enter user id"
                  : searchBy === "name"
                  ? "Enter user name"
                  : "Enter user email"
              }
              className="p-1 lg:w-[15rem] w-full focus:outline-none placeholder:italic 
                rounded-xl "
            />
            {/* linke to order details */}
            <CiSearch
              onClick={searchByHandler}
              className=" text-gray-500 rounded-full p-1  w-9 h-9  cursor-pointer 
                hover:bg-[#FAFAFC] "
            />
          </div>
        </div>
        {(filterSet.createdAt || filterSet.isAdmin) && (
          <div className="flex gap-2 mb-3 mt-2 justify-start flex-wrap">
            {filterSet.createdAt && (
              <div
                className=" bg-[#e7f1f7] 
                      flex items-center rounded-full pl-4  pr-2 text-gray-500 italic"
              >
                Create At: {filterSet.createdAt}
                <span className="h-5 w-[2px] border m-2 border-white"></span>
                <FaDeleteLeft
                  onClick={() => setFilterSet({ ...filterSet, createdAt: "" })}
                  className="cursor-pointer hover:text-red-600"
                />
              </div>
            )}
            {filterSet.isAdmin && (
              <div
                className=" bg-[#e7f1f7] 
                      flex items-center rounded-full pl-4  pr-2 text-gray-500 italic"
              >
                Is Admin: {filterSet.isAdmin}
                <span className="h-5 w-[2px] border m-2 border-white"></span>
                <FaDeleteLeft
                  onClick={() => setFilterSet({ ...filterSet, isAdmin: "" })}
                  className="cursor-pointer hover:text-red-600"
                />
              </div>
            )}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="mb-[1rem] pb-5 mt-[1rem]  w-full overflow-x-auto  rounded shadow-[0px_2px_10px_rgba(0,0,0,0.1)]">
          <table className="w-full text-sm sm:text-base ">
            <thead>
              <tr>
                <th className="p-4 pl-6 text-start bg-[#FAFAFC] ">ID</th>
                <th className="p-4 text-start bg-[#FAFAFC]">Created At</th>
                <th className="p-4 text-start bg-[#FAFAFC]">Name</th>
                <th className="p-4 text-start bg-[#FAFAFC]">Email</th>
                <th className="p-4 text-start bg-[#FAFAFC]">Is Admin</th>
                <th className="p-4 text-start bg-[#FAFAFC]">Actions</th>
              </tr>
            </thead>
            {error?.status < 500 && (
              <tbody className="text-gray-500">
                <tr>
                  <td colSpan={6} className="p-4 text-center">
                    {error?.data?.message || "Something went wrong"}
                  </td>
                </tr>
              </tbody>
            )}
            {users?.data?.users?.length === 0 && (
              <tbody className="text-gray-500">
                <tr>
                  <td colSpan={6} className="p-4 text-center">
                    No User Found
                  </td>
                </tr>
              </tbody>
            )}
            {!isFetching && (
              <tbody className="text-gray-500">
                {!error &&
                  users?.data?.users?.map((user) => (
                    <tr
                      key={user._id}
                      className={`${selectedUser === user._id && "bg-sky-50"}`}
                    >
                      <td
                        className={`p-4 pl-6 min-w-50 `}
                      >
                        <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedUser === user._id}
                          onChange={() => slectedUserHandler(user._id)}
                          className="cursor-pointer w-4 h-4"
                        />
                        <span className="py-2">{user._id}</span>
                        </div>
                      </td>
                      <td className=" p-4  min-w-30  max-w-55 ">
                        {user.createdAt?.substring(0, 10)}
                      </td>
                      <td className=" p-4 min-w-50  max-w-55 ">
                        {editableuserId === user._id ? (
                          <div className="flext items-center">
                            <input
                              type="text"
                              value={editableName}
                              onChange={(e) => setEditableName(e.target.value)}
                              className="w-full p-2 border border-gray-300 
                              rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 "
                            />
                          </div>
                        ) : (
                          <div className="flex items-center">
                            {user.username}{" "}
                            {!user.isAdmin && (
                              <button
                                className="cursor-pointer"
                                onClick={() =>
                                  toggleEdite(
                                    user._id,
                                    user.username,
                                    user.email
                                  )
                                }
                              >
                                <FaEdit className="ml-[1rem]" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className=" p-4 min-w-50 ">
                        {editableuserId === user._id ? (
                          <div className="flext items-center">
                            <input
                              type="text"
                              value={editableEmail}
                              onChange={(e) => setEditableEmail(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg
                              focus:outline-none focus:ring-1 focus:ring-indigo-500 "
                            />
                          </div>
                        ) : (
                          <div className="flex items-center">
                            {user.email}{" "}
                            {!user.isAdmin && (
                              <button
                                className="cursor-pointer"
                                onClick={() =>
                                  toggleEdite(
                                    user._id,
                                    user.username,
                                    user.email
                                  )
                                }
                              >
                                <FaEdit className="ml-[1rem]" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                      <td className=" p-2 min-w-60 ">
                        {user.isAdmin ? (
                          <span
                            className="flex items-center justify-center 
                        text-green-800 w-18 p-1 border-1 bg-[#EEFAF6] border-green-800 rounded-full"
                          >
                            <FaCheck />
                            <span className="ml-2  font-semibold">Yse</span>
                          </span>
                        ) : (
                          <div className="flex  items-center justify-between">
                            <span
                              className="flex items-center justify-center 
                        text-red-700 w-18 p-1 border-1 bg-[#FDEAE9] border-red-700 rounded-full"
                            >
                              <FaTimes />
                              <span className="ml-2  font-semibold">No</span>
                            </span>
                            <div
                              className="cursor-pointer border-2  border-indigo-500 text-indigo-500 rounded-full p-1 px-3 hover:bg-indigo-500 hover:text-white"
                              onClick={() => makeAdminHandler(user._id)}
                            >
                              {isLoadingMakeAsAdmin &&
                              selectUserForAdmin === user._id ? (
                                <Loader />
                              ) : (
                                "Make as Admin"
                              )}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="flex min-w-30 justify-center p-4 items-center">
                        {!user.isAdmin && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                updateHandler(
                                  user._id,
                                  user.username,
                                  user.email
                                )
                              }
                              className="ml-2 cursor-pointer hover:bg-gray-100 bg-[#FAFAFC] text-blue-500 py-2 px-4 rounded-lg"
                            >
                              {editableuserId === user._id ? (
                                <FaCheck />
                              ) : (
                                <FaEdit />
                              )}
                            </button>
                            <button
                              onClick={() => deleteHandler(user._id)}
                              className="bg-[#FAFAFC] hover:bg-gray-100 text-red-500 font-bold
                              p-2 rounded cursor-pointer"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            )}
          </table>
          {isFetching && (
            <div className="flex justify-center h-[20rem] items-center gap-5">
              <Loader />
            </div>
          )}
        </div>
        {!isFetching && pagesCount > 1 && (
          <div className="flex justify-center  items-center gap-5">
            <PageSlider setPage={setPage} page={page} pagesCount={pagesCount} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
