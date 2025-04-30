export default function ProductLoader() {
  return (
    <div
      className="w-full max-w-sm p-2 h-full rounded-lg  bg-white  
      flex flex-col shadow-xs space-y-1.5"
    >
      <div
        className="relative w-full h-40 sm:h-48 md:h-52  rounded 
            bg-gray-100/50 animate-pulse"
      ></div>
      <div className={`w-full h-5 bg-gray-100/50 animate-pulse rounded`}></div>
      <div className={`w-[90%] h-4 bg-gray-100/50 animate-pulse rounded`}></div>
      <div className={`w-[80%] h-3 bg-gray-100/50 animate-pulse rounded`}></div>
      <div className={`w-[80%] h-3 bg-gray-100/50 animate-pulse rounded`}></div>
    </div>
  );
}
