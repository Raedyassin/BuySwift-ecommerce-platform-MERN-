export default function PageHeader({ children }) {
  return (
    <div
      className={`w-full h-[3rem] rounded-2xl bg-sky-50 text-sky-500 font-bold text-2xl 
        flex items-center gap-2 `}
    >
      <div className="w-5 h-full rounded-l-2xl bg-sky-300"></div>
      <div>{children}</div>
    </div>
  );
}
