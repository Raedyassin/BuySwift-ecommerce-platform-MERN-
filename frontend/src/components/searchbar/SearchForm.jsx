import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
export default function SearchForm({ searchName, setSearchName, setShowResults }) {
  const searchHandler = (e) => {
    e.preventDefault();
    if (e.target.value === " ") { 
      return setSearchName("");
    }
    const alreadySpaceExist =
      e.target.value[e.target.value.length - 1] === " " ? " " : "";
    let searchValue = e.target.value.trim().split(" ");
    searchValue = searchValue.reduce((acc, word) => {
      if (word === "") {
        return acc;
      } else {
        return `${acc} ${word}`;
      }
    }, "");
    searchValue = searchValue.trimStart() + alreadySpaceExist;
    setSearchName(searchValue);
  }
  const goToResult = () => {
    navigate(`/shop?search=${searchName}`);
    setShowResults(false);
  }
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center w-full gap-1 sm:gap-2 px-2 py-1 border 
      border-gray-200 rounded-md focus-within:ring-2 focus-within:ring-indigo-50"
    >
      <input
        type="text"
        placeholder="Search..."
        onChange={searchHandler}
        onFocus={() => setShowResults(true)}
        value={searchName}
        className="px-2 py-1 w-full text-sm sm:text-base rounded-md 
          focus:outline-none"
      />
      <FiSearch
        onClick={goToResult}
        className="text-3xl cursor-pointer 
        rounded-full hover:bg-indigo-50 p-1 hover:text-indigo-600 text-gray-600"
      />
    </div>
  );
}
