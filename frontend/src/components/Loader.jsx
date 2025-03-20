
export default function Loader({ loaderText }) {
  return (
    <div className="flex justify-center items-center gap-3">
      <span className="text-pink-300">{loaderText || ""}</span>
      <div
        className="animate-spin rounded-full h-5 w-5 border-t-4 border-pink-300 
        border-opacity-50"
      ></div>
    </div>
  );
}
