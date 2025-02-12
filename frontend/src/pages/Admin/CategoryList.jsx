import {
    useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useGetAllCategoryQuery,
  useDeleteCategoryMutation
} from "../../redux/apis/categoryApiSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modale from "../../components/Modale";
import AdminMenu from "./AdminMenu";
export default function CategoryList() {
  const { data: categories,refetch} = useGetAllCategoryQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [maodalVisiable, setModalVisiable] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const deleteCategoryHandler = async (e) => {
    e.preventDefault();
    try {
      await deleteCategory(selectedCategory._id).unwrap();
      setModalVisiable(false);
      setSelectedCategory(null);
      refetch();
    } catch (err) {
      if (err.status === 404 ) {
        toast.error(err.data.message);
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
  }
  const updateCategoryHandler = async (e) => {
    e.preventDefault();
    if (!updatingName) return toast.error("Name is required")
    try {
      await updateCategory({
        id: selectedCategory._id,
        body: {name:updatingName},
      }).unwrap();
      setModalVisiable(false);
      setSelectedCategory(null);
      setUpdatingName("");
      refetch();
    } catch (err) {
      console.log(err)
      if (err.status === 400 || err.status == 400 || err.status == 409) {
        toast.error(err.data.message);
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
  }

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setName(name.toLowerCase())
    if(!name) return toast.error("Name is required")
    try {
      await createCategory({ name }).unwrap();
      setName("")
      refetch();
    } catch (err) {
      console.log(err)
      if (err.status === 400 || err.status == 409) {
        toast.error(err.data.message);
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
  }

  return (
    <div className="mx-[5rem] flex w-full flex-col md:flex-row">
      {/* admin menu */}
      <AdminMenu/>
      <div className="md:3/4 w-[80%] p-3">
        <div className="h-12 text-2xl font-bold italic">Manage Categories</div>
        <CategoryForm
          id={"public"}
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
        />
        <br />
        <hr className="mx-3 text-[#86bcd3]" />

        <div className="flex p-3 flex-wrap my-2">
          {categories?.data?.categories?.map((categor) => (
            <div key={categor._id}>
              <button
                className="mr-2 mb-2 font-bold bg-white border border-[#0094D4] text-[#0094D4] 
                  py-2 px-4 rounded-lg cursor-pointer hover:bg-[#c9dde6]
                  focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-[#0094D4]"
                onClick={() => {
                  setModalVisiable(true);
                  setSelectedCategory(categor);
                  setUpdatingName(categor.name);
                }}
              >
                {categor.name}
              </button>
            </div>
          ))}
        </div>
        <Modale isOpen={maodalVisiable} isClose={() => setModalVisiable(false)}>
          <CategoryForm
            id={"private"}
            value={updatingName}
            setValue={(value) => setUpdatingName(value)}
            handleDelete={deleteCategoryHandler}
            handleSubmit={updateCategoryHandler}
            button={"Update"}
          />
        </Modale>
      </div>
    </div>
  );
}
