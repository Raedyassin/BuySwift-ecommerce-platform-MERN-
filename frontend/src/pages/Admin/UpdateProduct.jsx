import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../redux/apis/productApiSlice";
import { useEffect, useState } from "react";
import { useGetAllCategoryQuery } from "../../redux/apis/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
import { motion } from "motion/react";
import PageLoader from "../../components/PageLoader";
import ProductForm from "../../components/ProductForm";
export default function UpdateProduct() {
  const { id } = useParams();
  const [image, setImage] = useState("");
  const [newImage, setNewImage] = useState("");
  const [name, setName] = useState("");
  const [discription, setDiscription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");

  const navigate = useNavigate();

  const { data: product, isLoading } = useGetProductByIdQuery(id);
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const { data: categories } = useGetAllCategoryQuery();

  useEffect(() => {
    if (product) {
      setName(product.data.product.name);
      setDiscription(product.data.product.discription);
      setPrice(product.data.product.originalPrice);
      setCategory(product.data.product.category);
      setQuantity(product.data.product.quantity);
      setBrand(product.data.product.brand);
      setImage(product.data.product.img);
      setNewImage(product.data.product.img);
      setDiscount(product.data.product.discount);
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
    if (!category) return toast.error("Category is required");
    if (!discount && discount !== 0)
      return toast.error("Discount is required  or equal 0");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("discription", discription);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("quantity", quantity);
    formData.append("brand", brand);
    if (newImage !== image) formData.append("img", newImage);
    formData.append("discount", discount === "" ? 0 : discount);

    try {
      await updateProduct({ id, body: formData }).unwrap();
      toast.success("Product updated successfully");
      navigate("/product/" + id);
    } catch (err) {
      if (err.status < 500) return toast.error(err.data.message);
      toast.error("Something went wrong. Please try again later.");
      console.error(err);
    }
  };

  const uploadFileHandler = async (e) => {
    e.preventDefault();
    setNewImage(e.target.files[0]);
    console.log(e.target.files[0]);
  };

  useEffect(() => {
    window.document.title = "Update Product: " + product?.data?.product?.name;
    window.scrollTo(0, 0);
  }, [product]);

  const handleDelete = (e) => {
    e.preventDefault();
    try {
      deleteProduct(id).unwrap();
      toast.success("Product deleted successfully");
      navigate("/admin/allproductslist");
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
      console.error(err);
    }
  };

  if (isLoading) return <PageLoader />;

  return (
    <>
      <AdminMenu />
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="min-h-screen flex flex-col lg:flex-row"
      >
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Update Product
            </h1>

            {/* Image Upload Section */}
            {newImage && (
              <div className="flex justify-center mb-6">
                <img
                  src={
                    newImage !== image
                      ? URL.createObjectURL(newImage)
                      : "/uploads/" + image.split("/").pop()
                  }
                  alt={name}
                  className="max-h-48 rounded-lg  object-cover"
                />
              </div>
            )}
            <div className="mb-6">
              <label className="flex items-center justify-center w-full px-4 py-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200 transition duration-300">
                <span className="text-gray-600 font-medium">
                  {newImage ? newImage.name || "Upload Image" : "Upload Image"}
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
              description={discription}
              setDescription={setDiscription}
              brand={brand}
              setBrand={setBrand}
              category={category}
              setCategory={setCategory}
              categories={categories?.data?.categories}
              handleSubmit={handleSubmit}
              handleDelete={handleDelete}
            />

          </div>
        </div>
      </motion.div>
    </>
  );
}
