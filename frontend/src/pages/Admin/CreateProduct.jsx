import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
} from "../../redux/apis/productApiSlice";
import { useGetAllCategoryQuery } from "../../redux/apis/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import { motion } from "motion/react";

export default function CreateProduct() {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [discription, setDiscription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const navigate = useNavigate();

  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useGetAllCategoryQuery();

  useEffect(() => {
    window.document.title = "Create Product";
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return toast.error("Name is required");
    if (!price) return toast.error("Price is required");
    // if (+price < 0) return toast.error("Price must be greater than or equal 0");
    if (!quantity) return toast.error("Quantity is required");
    // if (+quantity < 0) return toast.error("Quantity must be greater than or equal 0");
    if (!brand) return toast.error("Brand is required");
    if (!discription) return toast.error("discription is required");
    if (!category) return toast.error("Category is required");
    if (!image) return toast.error("Choose image is required");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("discription", discription);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("brand", brand);
    formData.append("img", image);
    formData.append("discount", discount === "" ? 0 : discount);

    try {
      await createProduct(formData).unwrap();
      toast.success("Product created successfully");
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log("err", err);
      if(err.status < 500) return toast.error(err.data.message);
      toast.error("Something went wrong. Please try again later.");
      console.error(err);
    }
  };

  const discontHandler = (e) => {
    const dis = +e.target.value;
    if (dis < 0) {
      return discount;
    }
    if (dis > 100) {
      return discount;
    }
    return dis.toString();
  };

  const uploadFileHandler = async (e) => {
    e.preventDefault();
    setImage(e.target.files[0]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="min-h-screen flex flex-col lg:flex-row"
    >
      {/* Admin Menu */}
      <AdminMenu />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Create Product
          </h1>

          {/* Image Upload Section */}
          {image && (
            <div className="flex justify-center mb-6">
              <img
                src={URL.createObjectURL(image)}
                alt={image.name}
                className="max-h-48 rounded-lg shadow-md object-cover"
              />
            </div>
          )}
          <div className="mb-6">
            <label className="flex items-center justify-center w-full px-4 py-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-300">
              <span className="text-gray-600 font-medium">
                {image ? image.name : "Upload Image"}
              </span>
              <input
                type="file"
                name="img"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>

          {/* Form Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Product Name"
                  className="w-full p-2 sm:p-3 border border-gray-200 
                    rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-indigo-500 transition-all duration-200 
                    bg-gray-50 hover:bg-white text-sm sm:text-base"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="quantatity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantatity
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Product Quantatity"
                  name="quantatity"
                  id="quantatity"
                  className="w-full p-2 sm:p-3 border border-gray-200 
                    rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-indigo-500 transition-all duration-200 
                    bg-gray-50 hover:bg-white text-sm sm:text-base"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Number(e.target.value) >= 0 ? e.target.value : quantity
                    )
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  name="price"
                  placeholder="Product Price"
                  id="price"
                  className="w-full p-2 sm:p-3 border border-gray-200 
                    rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-indigo-500 transition-all duration-200 
                    bg-gray-50 hover:bg-white text-sm sm:text-base"
                  value={price}
                  onChange={(e) =>
                    setPrice(
                      Number(e.target.value) >= 0 ? e.target.value : price
                    )
                  }
                />
              </div>
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Discount Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  name="price"
                  id="price"
                  placeholder="0% to 100%"
                  className="w-full p-2 sm:p-3 border border-gray-200 
                    rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-indigo-500 transition-all duration-200 
                    bg-gray-50 hover:bg-white text-sm sm:text-base"
                  value={discount}
                  onChange={(e) =>
                    setDiscount(
                      discontHandler(e) === 0 ? "" : discontHandler(e)
                    )
                  }
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="discription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Discription
              </label>
              <textarea
                type="text"
                name="discription"
                id="discription"
                rows="3"
                placeholder="Product Discription"
                className="w-full p-2 sm:p-3 border border-gray-200 
                    rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-indigo-500 transition-all duration-200 
                    bg-gray-50 hover:bg-white text-sm sm:text-base"
                value={discription}
                onChange={(e) => setDiscription(e.target.value)}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Brand
                </label>
                <input
                  type="text"
                  name="brand"
                  id="brand"
                  placeholder="Product Brand"
                  className="w-full p-2 sm:p-3 border border-gray-200 
                    rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-indigo-500 transition-all duration-200 
                    bg-gray-50 hover:bg-white text-sm sm:text-base"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  className="w-full p-2 sm:p-3 border border-gray-200 
                    rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-indigo-500 transition-all duration-200 
                    bg-gray-50 hover:bg-white text-sm sm:text-base"
                  // className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2  focus:ring-blue-500 "
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories?.data?.categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                className=" w-full sm:w-auto cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium text-sm sm:text-base hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                // className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
