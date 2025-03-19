
export default function PageHeaderSecond({ children }) {
  return (
    <div
      className={`w-full h-[3rem] rounded-2xl bg-green-50 text-green-500 
        font-bold text-xl flex items-center gap-2 `}
    >
      <div className="w-5 h-full rounded-l-2xl bg-green-300"></div>
      <div>{children}</div>
    </div>
  );
}
