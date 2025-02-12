import { useState } from "react"
import Loader from "../../components/Loader"
import { toast } from "react-toastify"
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa'
import {
  useGetAllUsersByAdminQuery,
  useDeleteUserByAdminMutation,
  useUserUpdateDetailsByAdminMutation
} from "../../redux/apis/userApiSlice"
import Message from "../../components/Message"
import AdminMenu from "./AdminMenu"
export default function UserList() {
  const { data: users,refetch, error, isLoading } = useGetAllUsersByAdminQuery()
  const [deleteUser] = useDeleteUserByAdminMutation()
  const [updateUser] = useUserUpdateDetailsByAdminMutation()
  
  const [editableuserId, setEditableUserId] = useState(null);
  const [editableName, setEditableName] = useState("");
  const [editableEmail, setEditableEmail] = useState("");
  const [userDateBeforUpdate, setUserDateBeforUpdate] = useState({});

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you Sure?")) {
      return;
    }
    try {
      const res = await deleteUser(id).unwrap();
      console.log(res)
      toast.success("user with " + id + " is deleted")
      refetch();
    } catch (err) {
      if (err.status === 404) {
        toast.error(err.data.message)
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
  }
  const toggleEdite = (id, username, email) => {
    setEditableUserId(id);
    setEditableName(username)
    setEditableEmail(email)
    setUserDateBeforUpdate({username,email})
  }
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
        alert("Something went wrong. Please try again later.");
      }
    }
  };
  
  return (
    <div className="p-4">
      <AdminMenu />
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data.message || error.data.message}
        </Message>
      ) : (
        <div className="flex flex-col md:flex-row">
          <table className="w-full  md:w-4/5 mx-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">IsAdmin</th>
              </tr>
            </thead>
            <tbody>
              {users?.data.users.map((user) => (
                <tr key={user._id}>
                  <td className=" px-4 py-2">{user._id}</td>
                  <td className=" px-4 py-2">
                    {editableuserId === user._id ? (
                      <div className="flext items-center">
                        <input
                          type="text"
                          value={editableName}
                          onChange={(e) => setEditableName(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {user.username}{" "}
                        {!user.isAdmin && (
                          <button
                            className="cursor-pointer"
                            onClick={() =>
                              toggleEdite(user._id, user.username, user.email)
                            }
                          >
                            <FaEdit className="ml-[1rem]" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className=" px-4 py-2">
                    {editableuserId === user._id ? (
                      <div className="flext items-center">
                        <input
                          type="text"
                          value={editableEmail}
                          onChange={(e) => setEditableEmail(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {user.email}{" "}
                        {!user.isAdmin && (
                          <button
                            className="cursor-pointer"
                            onClick={() =>
                              toggleEdite(user._id, user.username, user.email)
                            }
                          >
                            <FaEdit className="ml-[1rem]" />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                  <td className=" px-4 py-2">
                    {user.isAdmin ? (
                      <FaCheck style={{ color: "green" }} />
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td className="flex items-center">
                    {!user.isAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateHandler(user._id,user.username,user.email)}
                          className="ml-2 cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-lg"
                        >
                          {
                            editableuserId === user._id ? <FaCheck />:<FaEdit />
                          }
                        </button>
                        <button
                          onClick={() => deleteHandler(user._id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold
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
          </table>
        </div>
      )}
    </div>
  );
}
