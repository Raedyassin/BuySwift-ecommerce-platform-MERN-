import PageHeader from "./PageHeader";

export default function CategoryForm({
  id,
  value,
  setValue,
  handleSubmit,
  handleDelete,
  button = "Submit"
}) {
  return (
    <div className=" ">
      <form onSubmit={handleSubmit} className="space-y-2 w-full">
        <label htmlFor={id} className="block text-sm  font-simibold italic mb-2">
          {/* <PageHeader>
          </PageHeader> */}
          Create Category
        </label>
        <input
          type="text"
          value={value}
          id={id}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter Category"
          className="py-3 border-gray-200 border-1 focus:border-gray-400  px-4 rounded 
          focus:outline-none  border-lg w-full "
        />
        <div className="flex justify-center mt-2 gap-2 ">
          <button
            type="submit"
            className="text-white py-2 px-4 rounded-lg focus:outline-none
              focus:ring-2 focus:ring-blue-400 hover:bg-[#0083d4] bg-[#0094D4] cursor-pointer
              focus:ring-opacity-50"
          >
            {button}
          </button>
          {handleDelete && (
            <button
              type="button"
              className=" text-white  py-2 px-4 rounded-lg focus:outline-none
                focus:ring-2 focus:ring-red-400 bg-red-500 hover:bg-red-600
                focus:ring-opacity-50 cursor-pointer"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
