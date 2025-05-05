import Loader from "./Loader";

export default function CategoryForm({
  id,
  value,
  setValue,
  handleSubmit,
  handleDelete,
  isLoadingDelete,
  isLoadingSubmit,
  button = "Submit"
}) {
  return (
    <div className=" ">
      <form onSubmit={handleSubmit} className="space-y-2 w-full">
        <label
          htmlFor={id}
          className="block text-sm md:text-base  font-simibold italic mb-2"
        >
          Category Name
        </label>
        <input
          type="text"
          value={value}
          id={id}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter Category"
          className="py-3 border-gray-200 border-1
          focus:ring-1  focus:ring-indigo-400  px-4 rounded 
          focus:outline-none  border-lg w-full "
        />
        <div className="flex justify-center mt-2 gap-2 ">
          <button
            type="submit"
            className="text-sm md:text-base text-white py-2 px-4 rounded-lg focus:outline-none
            bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-colors duration-300 cursor-pointer
            disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md   focus:ring-opacity-50"
          >
            {isLoadingSubmit ? (
              <div className="flex items-center gap-1 justify-center">
                <span>Submitting</span>
                <Loader loaderColor="border-white" />
              </div>
            ) : (
              button
            )}
          </button>
          {handleDelete && (
            <button
              type="button"
              className="text-sm md:text-base text-white  py-2 px-4 rounded-lg focus:outline-none
                focus:ring-2 focus:ring-red-400 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md
                focus:ring-opacity-50 cursor-pointer"
              onClick={handleDelete}
            >
              {isLoadingDelete ? (
                <div className="flex items-center gap-1 justify-center">
                  <span>Deleting</span>
                  <Loader loaderColor="border-white" />
                </div>
              ) : (
                "Delete"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
