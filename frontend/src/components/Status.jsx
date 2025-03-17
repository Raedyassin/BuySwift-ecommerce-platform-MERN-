
export default function Status({ status }) {
  console.log("status", status);
  
  return (
    <div>
      {status === "pending" ? (
        <span className="text-yellow-500 bg-yellow-300 font-semibold rounded-full px-3 py-1">
          Pending
        </span>
      ) : status === "packed" ? (
        <span className="text-blue-500 bg-blue-300 font-semibold rounded-full px-3 py-1">
          Packed
        </span>
      ) : status === "ontheroute" ? (
        <span className="text-purple-500 bg-purple-300 font-semibold rounded-full px-3 py-1">
          On The Route
        </span>
      ) : status === "delivered" ? (
        <span className="text-green-500 bg-green-300 font-semibold rounded-full px-3 py-1">
          Delivered
        </span>
      ) : (
        <span className="text-red-500 bg-red-300 font-semibold rounded-full px-3 py-1">
          Cancelled
        </span>
      )}
    </div>
  );
}
