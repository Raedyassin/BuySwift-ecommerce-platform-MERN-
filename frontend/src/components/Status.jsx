import { GoDotFill } from "react-icons/go";

export default function Status({ status,border }) {
  return (
    <div>
      {status === "pending" ? (
        <div
          className={`flex items-center gap-1 text-[#FFB302] px-3 py-1
        bg-[#FCF6F0] w-[7rem] rounded-full fontbold border-${
          border ? "1" : "0"
        } border-[#FFB302]`}
        >
          <GoDotFill />
          <span>Pending</span>
        </div>
      ) : status === "packed" ? (
        <div
          className={`flex items-center gap-1 text-[#2DCCFF] px-3 py-1
        bg-[#f0f9fc] w-[7rem] rounded-full fontbold border-${
          border ? "1" : "0"
        } border-[#2DCCFF]`}
        >
          <GoDotFill />
          <span>Packed</span>
        </div>
      ) : status === "ontheroute" ? (
        <div
          className={`flex items-center gap-1 text-[#5b9bbb] px-3 py-1
        bg-[#ECF4FF] w-[9rem] rounded-full fontbold border-${
          border ? "1" : "0"
        } border-[#5b9bbb]`}
        >
          <GoDotFill />
          <span>On The Route</span>
        </div>
      ) : status === "delivered" ? (
        <div
          className={`flex items-center gap-1 text-[#56F000] px-3 py-1
        bg-[#EEFAF6] w-[7rem] rounded-full fontbold border-${
          border ? "1" : "0"
        } border-[#56F000]`}
        >
          <GoDotFill />
          <span>Delivered</span>
        </div>
      ) : (
        <div
          className={`flex items-center gap-1 text-[#FF3838] px-3 py-1
        bg-[#FDEAE9] w-[7rem] rounded-full fontbold border-${
          border ? "1" : "0"
        } border-[#FF3838]`}
        >
          <GoDotFill />
          <span>Cancelled</span>
        </div>
      )}
    </div>
  );
}
