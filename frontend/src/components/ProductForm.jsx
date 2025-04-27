export default function ProductForm({
  name,
  setName,
  quantity,
  setQuantity,
  price,
  setPrice,
  discount,
  setDiscount,
  description,
  setDescription,
  brand,
  setBrand,
  category,
  setCategory,
  categories,
  handleSubmit,
  handleDelete,
}) {
  
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

  return (
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
              setPrice(Number(e.target.value) >= 0 ? e.target.value : price)
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
              setDiscount(discontHandler(e) === 0 ? "" : discontHandler(e))
            }
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          type="text"
          name="description"
          id="description"
          rows="3"
          placeholder="Product Description"
          className="w-full p-2 sm:p-3 border border-gray-200 
                    rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-indigo-500 transition-all duration-200 
                    bg-gray-50 hover:bg-white text-sm sm:text-base"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      {/* brand and category */}
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
            {/* {categories?.data?.categories?.map((category) => ( */}
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          className="w-full sm:w-auto cursor-pointer bg-gradient-to-r 
          from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg 
          font-medium text-sm sm:text-base hover:from-indigo-700 
          hover:to-purple-700 transition-all duration-300 disabled:bg-gray-400 
          disabled:cursor-not-allowed shadow-md"
          onClick={handleSubmit}
        >
          Save Changes
        </button>
        <button
          className="w-full sm:w-auto cursor-pointer  text-white py-3 px-6 
          rounded-lg font-medium text-sm sm:text-base bg-gradient-to-r 
          from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 
          transition-all duration-300 disabled:bg-gray-400 
          disabled:cursor-not-allowed shadow-md"
          onClick={handleDelete}
        >
          Delete
        </button>{" "}
      </div>
    </div>
  );
}
