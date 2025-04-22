
export default function DontHave({ children, className }) {
  return (
    <div
      className={`flex justify-center italic  h-[20rem] text-2xl 
            font-bold text-red-400 ${className}`}
    >
      <div className="py-4 px-10  rounded-2xl ">
        {children}
      </div>
    </div>
  );
}
