import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateProductMutation } from "../../redux/apis/productApiSlice";
import { useGetAllCategoryQuery } from "../../redux/apis/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import { motion } from "motion/react";
import ProductForm from "../../components/ProductForm";

export default function CreateProduct() {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const navigate = useNavigate();

  const [createProduct, { isLoading }] = useCreateProductMutation();
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
    if (!description) return toast.error("description is required");
    if (!category) return toast.error("Category is required");
    if (!image) return toast.error("Choose image is required");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("discription", description);
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
      if (err.status < 500) return toast.error(err.data.message);
      toast.error("Something went wrong. Please try again later.");
      console.error(err);
    }
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
                className="max-h-48 rounded-lg object-cover"
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
          <ProductForm
            name={name}
            setName={setName}
            quantity={quantity}
            setQuantity={setQuantity}
            price={price}
            setPrice={setPrice}
            discount={discount}
            setDiscount={setDiscount}
            description={description}
            setDescription={setDescription}
            brand={brand}
            setBrand={setBrand}
            category={category}
            setCategory={setCategory}
            categories={categories?.data?.categories}
            handleSubmit={handleSubmit}
            handleDelete={false}
            isLoading = {isLoading}
          />
        </div>
      </div>
    </motion.div>
  );
}
