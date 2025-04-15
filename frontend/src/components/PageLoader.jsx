import { Discuss } from "react-loader-spinner";

export default function PageLoader({height}) {
  
  return (
    <div className={`flex justify-center items-center ${height || 'h-[70vh]'} `}>
      <Discuss
        className="w-full h-full "
        visible={true}
        height="130"
        width="130"
        ariaLabel="discuss-loading"
        colors={["#bdeb62", "#bdeb62", "#bdeb62", "#bdeb62", "#bdeb62"]}
        wrapperStyle={{}}
        wrapperClass="discuss-wrapper"
      />
    </div>
  );
}
