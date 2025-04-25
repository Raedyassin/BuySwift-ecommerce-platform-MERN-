import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
export default function PageSlider({ page, setPage, pagesCount }) {
  return (
    <div
        className="flex justify-center  items-center gap-5"
      >
        <MdKeyboardDoubleArrowLeft
          onClick={() => setPage(1)}
        className="cursor-pointer text-gray-400 w-12 h-12 hover:bg-gray-100 
          p-1 rounded-full"
        />
        {
          <div className="flex items-center gap-2">
            {page > 1 && (
              <div
                onClick={() => setPage(page - 1)}
                className={`cursor-pointer flex items-center justify-center
            text-gray-400 w-15 h-10 hover:bg-gray-100 p-1 rounded-full `}
              >
                {"..."}
                {page - 1}
              </div>
            )}
            <div
              className={`cursor-pointer flex items-center justify-center
              text-gray-400 w-15 h-10 hover:bg-gray-100 p-1 rounded-full
              bg-gray-100`}
            >
              {page}
            </div>
            {page < pagesCount && (
              <div
                onClick={() => setPage(page + 1)}
                className={`cursor-pointer flex items-center justify-center
            text-gray-400 w-15 h-10 hover:bg-gray-100 p-1 rounded-full`}
              >
                {page + 1} {"..."}
              </div>
            )}{" "}
          </div>
        }
        <MdKeyboardDoubleArrowRight
          onClick={() => {
            setPage(pagesCount);
          }}
        className="cursor-pointer text-gray-400 w-12 h-12 hover:bg-gray-100 
          p-1 rounded-full"
        />
      </div>
  )
}
