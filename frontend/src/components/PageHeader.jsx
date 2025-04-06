export default function PageHeader({ children }) {
  return (
    <div
      className={`w-full  rounded-2xl bg-gradient-to-r from-sky-100 via-sky-50 to-sky-50 text-sky-500 font-bold 
        text-2xl px-6 pl-0 h-16
        flex items-center gap-2 `}
    >
      <div className="w-5 h-full rounded-l-2xl bg-sky-300"></div>
      <div>{children}</div>
    </div>
  );
}
