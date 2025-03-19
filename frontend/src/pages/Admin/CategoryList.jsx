import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useGetAllCategoryQuery,
  useDeleteCategoryMutation,
} from "../../redux/apis/categoryApiSlice";
import { useState } from "react";
import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modale from "../../components/Modale";
import AdminMenu from "./AdminMenu";
import PageLoader from "../../components/PageLoader";
import Message from "../../components/Message";
import PageHeader from "../../components/PageHeader";
import PageHeaderSecond from "../../components/PageHeaderSecond";
import Loader from "../../components/Loader";
import { motion } from "motion/react";
export default function CategoryList() {
  const {
    data: categories,
    refetch,
    error,
    isFetching,
    isLoading,
  } = useGetAllCategoryQuery();
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [maodalVisiable, setModalVisiable] = useState(false);

  const [createCategory, { error: createCategoryError }] =
    useCreateCategoryMutation();
  const [updateCategory, { error: updateCategoryError }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { error: deleteCategoryError }] =
    useDeleteCategoryMutation();

  const deleteCategoryHandler = async (e) => {
    e.preventDefault();
    try {
      await deleteCategory(selectedCategory._id).unwrap();
      setModalVisiable(false);
      setSelectedCategory(null);
      refetch();
    } catch (err) {
      if (err.status === 404) {
        toast.error(err.data.message);
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
  };
  const updateCategoryHandler = async (e) => {
    e.preventDefault();
    if (!updatingName) return toast.error("Name is required");
    try {
      await updateCategory({
        id: selectedCategory._id,
        body: { name: updatingName },
      }).unwrap();
      setModalVisiable(false);
      setSelectedCategory(null);
      setUpdatingName("");
      refetch();
    } catch (err) {
      console.log(err);
      if (err.status === 400 || err.status == 400 || err.status == 409) {
        toast.error(err.data.message);
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setName(name.toLowerCase());
    if (!name) return toast.error("Name is required");
    try {
      await createCategory({ name }).unwrap();
      setName("");
      refetch();
    } catch (err) {
      console.log(err);
      if (err.status === 400 || err.status == 409) {
        toast.error(err.data.message);
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  if (isLoading) return <PageLoader />;
  if (error) {
    return (
      <Message variant="error">
        {error?.data?.message || error?.message}
      </Message>
    );
  }

  return (
    <div className="mx-[2rem] pt-[2rem] flex  flex-col md:flex-row">
      {/* admin menu */}
      <AdminMenu />
      {/* <div className="md:3/4 w-[80%] p-3"> */}
      <div className=" w-full  p-3">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: -100 }}
          transition={{ duration: 1 }}
        >
          <PageHeader>Manage Categories</PageHeader>
        </motion.div>
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -100 }}
          transition={{ duration: 1 }}
          className="p-5 shadow-[0px_-5px_10px_rgba(0,0,0,0.1)] rounded-2xl
          my-[1rem] mx-auto lg:w-[30rem] w-full"
        >
          <CategoryForm
            id={"public"}
            value={name}
            setValue={setName}
            handleSubmit={handleCreateCategory}
            button={"Create"}
          />
        </motion.div>
        {/* <br /> */}
        {/* <hr className="mx-3 text-[#86bcd3]" /> */}

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 100 }}
          transition={{ duration: 1 }}
          className="p-5 min-h-[22rem] shadow-[0px_5px_10px_rgba(0,0,0,0.1)]"
        >
          <div className="w-full lg:w-2/5">
            <PageHeaderSecond>Category List</PageHeaderSecond>
          </div>
          <div
            className="flex mt-4 flex-wrap my-2 rounded-lg
        "
          >
            {isFetching && (
              <div className="w-full h-full flex justify-center items-center">
                <Loader />
              </div>
            )}
            {!isFetching &&
              categories?.data?.categories?.map((categor) => (
                <div key={categor._id}>
                  <button
                    className="mr-2 mb-2 font-bold bg-green-50 border border-green-500 text-green-500 
                  py-2 px-4 rounded-lg cursor-pointer hover:bg-green-500 hover:text-white
                  focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-green-400 "
                    //   className="mr-2 mb-2 font-bold bg-white border border-[#0094D4] text-[#0094D4]
                    // py-2 px-4 rounded-lg cursor-pointer hover:bg-[#c9dde6]
                    // focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-[#0094D4]"
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
        </motion.div>
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
