import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useGetAllCategoryQuery,
  useDeleteCategoryMutation,
} from "../../redux/apis/categoryApiSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modale from "../../components/Modale";
import AdminMenu from "./AdminMenu";
import PageLoader from "../../components/PageLoader";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { motion } from "motion/react";
import PageHeader from "../../components/PageHeader";

export default function CategoryManagement() {
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
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

    useEffect(() => {
      window.document.title = "Category Table";
      window.scrollTo(0, 0);
    }, []);


  const deleteCategoryHandler = async (e) => {
    e.preventDefault();
    try {
      await deleteCategory(selectedCategory._id).unwrap();
      setModalVisible(false);
      setSelectedCategory(null);
      toast.success("Category deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete category");
    }
  };

  const updateCategoryHandler = async (e) => {
    e.preventDefault();
    if (!updatingName.trim()) return toast.error("Category name is required");
    try {
      await updateCategory({
        id: selectedCategory._id,
        body: { name: updatingName },
      }).unwrap();
      setModalVisible(false);
      setSelectedCategory(null);
      setUpdatingName("");
      toast.success("Category updated successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update category");
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    const formattedName = name.trim().toLowerCase();
    if (!formattedName) return toast.error("Category name is required");
    try {
      await createCategory({ name: formattedName }).unwrap();
      setName("");
      toast.success("Category created successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create category");
    }
  };

  if (isLoading) return <PageLoader />;
  if (error) {
    return (
      <Message variant="error">
        {error?.data?.message || "An error occurred"}
      </Message>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8  min-h-screen">
      <AdminMenu />
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="w-full">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <PageHeader>
              {" "}
              <h1
                className="text-2xl font-medium tracking-wider flex 
              items-center gap-3"
              >
                Category Management
              </h1>
            </PageHeader>
          </motion.div>

          {/* Create Category Form */}
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-8 bg-white rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] p-6 max-w-lg mx-auto 
            "
          >
            <h2 className="text-lg font-semibold text-teal-900 mb-4">
              Create New Category
            </h2>
            <CategoryForm
              id="public"
              value={name}
              setValue={setName}
              handleSubmit={handleCreateCategory}
              button="Create"
              className="space-y-4"
            />
          </motion.div>

          {/* Category List */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-8 bg-white rounded-xl shadow-[0px_0px_10px_rgba(0,0,0,0.1)] overflow-hidden "
          >
            {/* <div className="bg-gradient-to-r from-fuchsia-500 to-slate-200 text-white px-6 py-4"> */}
            <div className="  px-6 py-4">
              <h2 className="text-lg font-medium  tracking-wider">
                Category List
              </h2>
            </div>
            <div className="p-6">
              {isFetching ? (
                <div className="flex justify-center items-center h-32">
                  <Loader />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories?.data?.categories?.map((category) => (
                    <button
                      key={category._id}
                      onClick={() => {
                        setModalVisible(true);
                        setSelectedCategory(category);
                        setUpdatingName(category.name);
                      }}
                      className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 text-indigo-500 rounded-lg 
                        hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200 focus:outline-none focus:ring-2 
                        focus:ring-indigo-400 focus:ring-opacity-50 cursor-pointer"
                    >
                      <span className="font-medium truncate">
                        {category.name}
                      </span>
                      <span className="text-sm text-indigo-400">Edit</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Modal for Update/Delete */}
          <Modale isOpen={modalVisible} isClose={() => setModalVisible(false)}>
            <div
              className="p-6 bg-white rounded-xl "
            >
              {/* <div className="bg-gradient-to-r from-teal-900 to-teal-700 text-white px-4 py-3 rounded-t-xl -mx-6 -mt-6 mb-4"> */}
              <div className=" px-4 py-3 rounded-t-xl -mx-6 -mt-6 mb-4">
                <h2 className="text-lg font-medium  tracking-wider">
                  Edit Category
                </h2>
              </div>
              <CategoryForm
                id="private"
                value={updatingName}
                setValue={setUpdatingName}
                handleDelete={deleteCategoryHandler}
                handleSubmit={updateCategoryHandler}
                button="Update"
                className="space-y-4"
              />
            </div>
          </Modale>
        </div>
      </div>
    </div>
  );
}
