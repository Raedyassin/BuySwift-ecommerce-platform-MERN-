import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
} from "../../redux/apis/productApiSlice";
import { useEffect, useState } from "react";
import { useGetAllCategoryQuery } from "../../redux/apis/categoryApiSlice";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import AdminMenu from "./AdminMenu";
import { motion } from "motion/react";
import PageLoader from "../../components/PageLoader";
export default function UpdateProduct() {
  const { id } = useParams();
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [discription, setDiscription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();

  const { data: product, isLoading, refetch } = useGetProductByIdQuery(id);
  console.log(product);
  const [deleteProduct] = useDeleteProductMutation();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const { data: categories } = useGetAllCategoryQuery();

  useEffect(() => {
    if (product) {
      setName(product.data.product.name);
      setDiscription(product.data.product.discription);
      setPrice(product.data.product.price);
      setCategory(product.data.product.category);
      setQuantity(product.data.product.quantity);
      setBrand(product.data.product.brand);
      setStock(product.data.product.countInStock);
      setImageUrl(product.data.product.img);
      setImage(product.data.product.img);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return toast.error("Name is required");
    if (!price) return toast.error("Price is required");
    if (+price < 0) return toast.error("Price must be greater than or equal 0");
    if (!quantity) return toast.error("Quantity is required");
    if (+quantity < 0)
      return toast.error("Quantity must be greater than or equal 0");
    if (!brand) return toast.error("Brand is required");
    if (!discription) return toast.error("discription is required");
    if (!stock) return toast.error("Stock is required");
    if (+stock < 0) return toast.error("Stock must be greater than or equal 0");
    if (!category) return toast.error("Category is required");
    if (!imageUrl) return toast.error("Choose image is required");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("discription", discription);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("brand", brand);
    formData.append("countInStock", stock);
    formData.append("img", imageUrl);

    try {
      await updateProduct({ id, body: formData }).unwrap();
      toast.success("Product updated successfully");
      navigate("/");
      refetch();
    } catch (err) {
      alert("Something went wrong. Please try again later.");
      console.log(err);
    }
  };

  const uploadFileHandler = async (e) => {
    e.preventDefault();
    const fromData = new FormData();
    fromData.append("img", e.target.files[0]);
    try {
      const res = await uploadProductImage(fromData).unwrap();
      toast.success("Image uploaded successfully");
      setImageUrl(res.data.image);
      setImage(e.target.files[0]);
      console.log(res.data.image);
    } catch (err) {
      if (err.status === 400) {
        toast.error("Image must be less than 10 MB");
      }
      console.log(err);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    try {
      deleteProduct(id).unwrap();
      toast.success("Product deleted successfully");
      navigate("/");
    } catch (err) {
      alert("Something went wrong. Please try again later.");
      console.log(err);
    }
  };

  if (isLoading) return <PageLoader/>;

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
            Update Product
          </h1>

          {/* Image Upload Section */}
          {imageUrl && (
            <div className="flex justify-center mb-6">
              <img
                src={
                  image instanceof File
                    ? URL.createObjectURL(image)
                    : "/" + imageUrl
                }
                alt="product image"
                className="max-h-48 rounded-lg shadow-md object-cover"
              />
            </div>
          )}
          <div className="mb-6">
            <label className="flex items-center justify-center w-full px-4 py-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-300">
              <span className="text-gray-600 font-medium">
                {image ? image.name || "Upload Image" : "Upload Image"}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                  id="price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
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
                  name="quantatity"
                  id="quantatity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={discription}
                onChange={(e) => setDiscription(e.target.value)}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Count In Stock
                </label>
                <input
                  type="number"
                  min="0"
                  name="stock"
                  id="stock"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

            <div className="flex justify-center gap-4">
              <button
                // className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
                className="w-full sm:w-auto cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium text-sm sm:text-base hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                onClick={handleSubmit}
              >
                Save Changes
              </button>
              <button
                className="w-full sm:w-auto cursor-pointer bg-gradient-to-r from-red-600 to-pink-600 text-white py-3 px-6 rounded-lg font-medium text-sm sm:text-base hover:from-red-700 hover:to-pink-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                onClick={handleDelete}
              >
                Delete
              </button>{" "}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
