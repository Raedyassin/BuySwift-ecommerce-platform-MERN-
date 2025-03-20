
export default function DontHave({ children }) {
  return (
    <div
      className="flex justify-center italic items-center h-[20rem] text-2xl 
            font-bold text-red-400"
    >
      <div className="py-4 px-10 border-4 rounded-2xl border-red-400">
        {children}
      </div>
    </div>
  );
}
