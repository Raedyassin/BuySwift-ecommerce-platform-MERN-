export default function PageHeader({ children, className }) {
  return (
    <div
      // h-13
      className={`w-full rounded-2xl 
        font-bold  px-6 pl-0   text-indigo-900
        flex items-center gap-2 ${
          className ? className : "text-xl md:text-2xl h-13"
        }`}
    >
      <div className="w-5 h-full rounded-l-2xl bg-indigo-100"></div>
      <div>{children}</div>
    </div>
  );
}
