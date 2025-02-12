export default function CategoryForm({
  id,
  value,
  setValue,
  handleSubmit,
  handleDelete,
  button = "Submit"
}) {
  return (
    <div className="p-3">
      <form onSubmit={handleSubmit} className="space-y-2 w-full">
        <label htmlFor={id} className="block tex-lg font-bold mb-2">
          Category Name
        </label>
        <input
          type="text"
          value={value}
          id={id}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter Category"
          className="py-3  px-4 rounded border border-lg w-full "
        />
        <div className="flex justify-between  ">
          <button
            type="submit"
            className="text-white py-2 px-4 rounded-lg focus:outline-none
              focus:ring-2 focus:ring-pink-400 bg-[#0094D4] cursor-pointer
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
