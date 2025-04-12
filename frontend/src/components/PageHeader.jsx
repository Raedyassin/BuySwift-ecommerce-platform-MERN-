export default function PageHeader({ children }) {
  return (
    <div
      className={`w-full rounded-2xl 
        font-bold text-2xl px-6 pl-0 h-13  text-indigo-900
        flex items-center gap-2 `}
    >
      <div className="w-5 h-full rounded-l-2xl bg-indigo-100"></div>
      <div>{children}</div>
    </div>
  );
}
