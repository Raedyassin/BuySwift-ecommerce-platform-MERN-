import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from '../../redux/apis/productApiSlice'
import { useGetAllCategoryQuery } from "../../redux/apis/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";
export default function ProductList() {
  const [image,setImage]=useState("")
  const [name,setName]=useState("")
  const [discription, setDiscription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useGetAllCategoryQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return toast.error("Name is required")
    if (!price) return toast.error("Price is required")
    if (+price < 0) return toast.error("Price must be greater than or equal 0")
    if (!quantity) return toast.error("Quantity is required")
    if (+quantity < 0) return toast.error("Quantity must be greater than or equal 0")
    if (!brand) return toast.error("Brand is required")
    if (!discription) return toast.error("discription is required")
    if (!stock) return toast.error("Stock is required")
    if (+stock < 0) return toast.error("Stock must be greater than or equal 0")
    if (!category) return toast.error("Category is required")
    if (!imageUrl) return toast.error("Choose image is required")

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
      await createProduct(formData).unwrap();
      toast.success("Product created successfully");
      navigate("/");
    } catch (err) {
      alert("Something went wrong. Please try again later.");
      console.log(err);
    }
  }

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
  }

  return (
    <div className="container  ">
      <div className="flex  flex-col md:flex-row">
        {/* admin menu */}
        <AdminMenu/>
        <div className="xl:w-3/4 p-3 sm:w-full">
          <div className="h-12 p-3 font-bold italic">Create Product</div>
          {imageUrl && (
            <div className="text-center">
              <img
                src={URL.createObjectURL(image)}
                alt="product image"
                className="block mx-auto max-h-[200px]"
              />
            </div>
          )}

          <div className="mb-3 p-3 ">
            <label
              className="border  px-4 block w-full text-center
              rounded-lg cursor-pointer font-bold py-11"
            >
              {image ? image.name : "Upload Image"}
              <input
                type="file"
                name="img"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
              />
            </label>
          </div>
          <div className="p-3">
            <div className="flex flex-wrap w-full gap-4">
              <div className="one  w-full xl:w-[49%]">
                <label htmlFor="name">Name</label>
                <br />
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="p-4 w-full mb-3  border border-gray-400 rounded-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="two  w-full xl:w-[49%]">
                <label htmlFor="price">Price</label>
                <br />
                <input
                  type="number"
                  min="0"
                  name="price"
                  id="price"
                  className="p-4 w-full mb-3  border border-gray-400 rounded-lg"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap w-full gap-4">
              <div className="one w-full xl:w-[49%]">
                <label htmlFor="quantatity">Quantatity</label>
                <br />
                <input
                  type="number"
                  min="0"
                  name="quantatity"
                  id="quantatity"
                  className="p-4 mb-3 w-full border border-gray-400 rounded-lg"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="two w-full xl:w-[49%]">
                <label htmlFor="brand">Brand</label>
                <br />
                <input
                  type="text"
                  name="brand"
                  id="brand"
                  className="p-4 mb-3 w-full border border-gray-400 rounded-lg"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="discription">Discription</label>
              <br />
              <textarea
                type="text"
                name="discription"
                id="discription"
                rows="3"
                className="p-4 mb-3 w-full border border-gray-400 rounded-lg"
                value={discription}
                onChange={(e) => setDiscription(e.target.value)}
              ></textarea>
            </div>
            <div className="flex flex-wrap w-full gap-4">
              <div className="one w-full xl:w-[49%]">
                <label htmlFor="stock">Count In Stock</label>
                <br />
                <input
                  type="number"
                  min="0"
                  name="stock"
                  id="stock"
                  className="p-4 mb-3 w-full border border-gray-400 rounded-lg"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div className="two w-full xl:w-[49%]">
                <label htmlFor="category">ِCategory</label>
                <br />
                <select
                  name="category"
                  id="category"
                  className="p-4 mb-3 w-full cursor-pointer border border-gray-400 rounded-lg"
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
            <div className="w-full flex justify-center items-center">
              <button
                className="text-white text-lg font-bold py-3 my-5 px-10 rounded-lg hover:bg-[#0078d4] bg-[#0094D4] cursor-pointer "
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
