
export default function Loader({ loaderText }) {
  return (
    <div className="flex justify-center items-center gap-3">
      <span className={`text-indigo-700`}>{loaderText || ""}</span>
      <div
        className={`animate-spin rounded-full h-5 w-5 border-t-4 
        border-opacity-100 border-indigo-700 `}
      ></div>
    </div>
  );
}
