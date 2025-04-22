import { useSelector } from "react-redux"

export default function SelectedCounteSidebar({ selectorinStore,className }) {
  const selecteItmes = useSelector((state) => {
    const keys = selectorinStore.split("."); 
    return keys.reduce((acc, key) => acc?.[key], state) || []; 
  });

  const ImtesCount = selecteItmes.length;
  return (
    <div className={`absolute left-2 top-4 ${className}`}>
      {ImtesCount > 0 && (
        <div className={`absolute text-[12px] top-[-4px] right-[-4px] bg-indigo-500 
        rounded-full w-5 h-5 flex justify-center  px-1 items-center text-white
        font-bold
        `}>
        {/* ${+ImtesCount > 9 ? "text-[10px]" : ""}`}> */}
          {+ImtesCount > 9 ? "9+" : ImtesCount}
        </div>
      )}
    </div>
  );
}
