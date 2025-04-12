import { FiSearch } from "react-icons/fi";

export default function SearchForm() {
  return (
    <div
      className="flex items-center w-full gap-1 sm:gap-2 px-2 py-1 border 
    border-gray-200 rounded-md focus-within:ring-2 focus-within:ring-indigo-50"
    >
      <input
        type="text"
        placeholder="Search..."
        className="px-2 py-1 w-full text-sm sm:text-base rounded-md 
        focus:outline-none"
      />
      <FiSearch
        className="text-3xl cursor-pointer 
      rounded-full hover:bg-indigo-50 p-1 hover:text-indigo-600 text-gray-600"
      />
    </div>
  );
}
