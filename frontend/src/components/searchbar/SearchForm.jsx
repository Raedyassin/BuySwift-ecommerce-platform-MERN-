import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { LiaTimesSolid } from "react-icons/lia";
import { useDispatch } from "react-redux";
import {
  chageToFixed,
  changeToRelative,
} from "../../redux/features/chagneSearchbarPosition";
import { changeToLightSearchbar } from "../../redux/features/hoemSearchbarEffect";
import {
  showSearchResult,
  hiddenSearchResult,
} from "../../redux/features/searchResult";

export default function SearchForm({
  searchName,
  setSearchName,
}) {
  const dispatch = useDispatch();
  const searchHandler = (e) => {
    e.preventDefault();
    dispatch(showSearchResult());
    dispatch(chageToFixed());
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
  };
  const goToResult = () => {
    navigate(`/shop?search=${searchName}`);
    dispatch(hiddenSearchResult());
    dispatch(changeToRelative());
  };
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center w-full gap-1 sm:gap-2 px-2 py-1
      rounded-full border border-gray-200 hover:border-gray-200 
      focus-within:border-gray-200 bg-gray-50  
      focus-within:ring-2 focus-within:ring-gray-50"
    >
      <FiSearch
        onClick={goToResult}
        className="text-3xl cursor-pointer rounded-full hover:bg-gray-100 p-1  text-gray-600"
      />
      <input
        type="text"
        placeholder="Search..."
        onChange={searchHandler}
        onFocus={() => {
          dispatch(showSearchResult());
          dispatch(chageToFixed());
        }}
        onKeyDown={(e) => e.key === "Enter" && goToResult()}
        value={searchName}
        className="px-2 py-1 w-full text-sm sm:text-base rounded-md 
          focus:outline-none"
      />
      <div>
        {searchName.trim() !== "" && (
          <LiaTimesSolid
            className="text-2xl cursor-pointer rounded-full hover:bg-gray-100 p-1  text-gray-600"
            onClick={() => setSearchName("")}
          />
        )}
      </div>
    </div>
  );
}
