import { Discuss } from "react-loader-spinner";

export default function PageLoader({height}) {
  
  return (
    <div
      className={`flex justify-center items-center ${height || "h-[70vh]"} `}
    >
      <Discuss
        className="w-full h-full "
        visible={true}
        height="130"
        width="130"
        ariaLabel="discuss-loading"
        colors={["#615FFF", "#615FFF", "#615FFF", "#615FFF", "#615FFF"]}
        wrapperStyle={{}}
        wrapperClass="discuss-wrapper"
      />
    </div>
  );
}
