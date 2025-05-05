import { FaBoxArchive } from "react-icons/fa6";
import { TfiPackage } from "react-icons/tfi";
import { TbTruckDelivery } from "react-icons/tb";
import { FaHome } from "react-icons/fa";
import { BiSpreadsheet } from "react-icons/bi";
import { GiCancel } from "react-icons/gi";
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from "react-icons/md";
import { useState } from "react";

export default function OrderProgress({ progress, createAt, isPaid }) {
  const [showDetails, setShowDetails] = useState(true);
  return (
    <div>
      <div className="flex items-center justify-between px-3 sm:px-5 py-2   gap-2">
        <div className={`flex  items-center     gap-2`}>
          <FaBoxArchive size={20} />
          <h1 className="font-bold text-xl  italic">Order Progress</h1>
        </div>
        {showDetails ? (
          <MdKeyboardArrowDown
            MdKeyboardArrowUp
            className="cursor-pointer hover:bg-gray-200 rounded-full w-7 h-7"
            onClick={() => setShowDetails(false)}
          />
        ) : (
          <MdKeyboardArrowUp
            className="cursor-pointer hover:bg-gray-200 rounded-full w-7 h-7"
            onClick={() => setShowDetails(true)}
          />
        )}
      </div>
      {showDetails && (
        <div className={`px-5 pl-10 ${showDetails ? "mb-10" : "mb-0"}`}>
          <div className="p-3 pb-1  flex flex-row items-center gap-3">
            <div
              className={` ${
                createAt ? "bg-green-300" : "bg-gray-100"
              } p-1 rounded-full  w-15 h-15 flex items-center justify-center`}
            >
              <BiSpreadsheet
                className={` ${createAt ? "text-green-950" : "gray"} block `}
                size={30}
              />
            </div>
            <div>
              <h3 className="font-s">Create</h3>
              <h4 className={`text-sm text-gray-400 font-semibold`}>
                {createAt?.substring(0, 10)}
              </h4>
            </div>
          </div>

          <div
            className={`h-7 ml-10  border-l-3 border-dashed border-gray-400 ${
              createAt ? "border-green-300" : "border-gray-100"
            }`}
          ></div>

          {progress?.cancelledAt ? (
            <>
              <div className="p-3 pt-1 pb-1 mb-3 flex flex-row items-center gap-3">
                <div
                  className={`bg-red-300 p-1 rounded-full  w-15 h-15 flex items-center justify-center`}
                >
                  <GiCancel className={`text-red-700 block `} size={30} />
                </div>
                <div>
                  <h3 className="font-s">Cancled</h3>
                  <h4 className={`text-sm text-gray-400 font-semibold`}>
                    {progress?.cancelledAt?.substring(0, 10)}
                  </h4>
                </div>
              </div>
              <div className="text-base font-bold text-center text-red-700">
                Sory your order is cancled
              </div>
              {isPaid && (
                <div className="text-base  text-gray-700">
                  Them Money will be Back after{" "}
                  <sapn className="font-semibold text-red-700">15 Days</sapn> of
                  cancled of{" "}
                  <span className="font-semibold text-red-700">
                    {progress?.cancelledAt?.substring(0, 10)}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div>
              <div className="p-3 py-1  flex flex-row items-center gap-3">
                <div
                  className={` ${
                    progress?.packedAt ? "bg-green-300" : "bg-gray-100"
                  } p-1 rounded-full  w-15 h-15 flex items-center justify-center`}
                >
                  <TfiPackage
                    className={` ${
                      progress?.packedAt ? "text-green-950" : "gray"
                    } block `}
                    size={30}
                  />
                </div>
                <div>
                  <h3 className="font-s">Packed</h3>
                  <h4 className={`text-sm text-gray-400 font-semibold`}>
                    {progress?.packedAt?.substring(0, 10)}
                  </h4>
                </div>
              </div>

              <div
                className={`h-7 ml-10  border-l-3 border-dashed border-gray-400 ${
                  progress?.packedAt ? "border-green-300" : "border-gray-100"
                }`}
              ></div>

              <div className="p-3 py-1 flex flex-row items-center gap-3">
                <div
                  className={` ${
                    progress?.transitAt ? "bg-green-300" : "bg-gray-100"
                  } p-1 rounded-full  w-15 h-15 flex items-center justify-center`}
                >
                  <TbTruckDelivery
                    className={` ${
                      progress?.transitAt ? "text-green-950" : "gray"
                    } block `}
                    size={30}
                  />
                </div>
                <div>
                  <h3 className="font-s">In Transit</h3>
                  <h4 className={`text-sm   text-gray-400 font-semibold`}>
                    {progress?.transitAt?.substring(0, 10)}
                  </h4>
                </div>
              </div>
              <div
                className={`h-7 ml-10  border-l-3 border-dashed border-gray-400 ${
                  progress?.transitAt ? "border-green-300" : "border-gray-100"
                }`}
              ></div>

              <div className="p-3 pt-1 flex flex-row items-center gap-3">
                <div
                  className={` ${
                    progress?.deliveredAt ? "bg-green-300" : "bg-gray-100"
                  } p-1 rounded-full  w-15 h-15 flex items-center justify-center`}
                >
                  <FaHome
                    className={` ${
                      progress?.deliveredAt ? "text-green-950" : "gray"
                    } block `}
                    size={30}
                  />
                </div>
                <div>
                  <h3 className="font-s">Delivered</h3>
                  <h4 className={`text-sm text-gray-400 font-semibold`}>
                    {progress?.deliveredAt?.substring(0, 10)}
                  </h4>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
