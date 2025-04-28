import { useRef, useState } from "react";

export default function ZoomImage({ src, name }) {
  const imgRef = useRef(null);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [zoomData, setZoomData] = useState({
    backgroundPosition: "0% 0%",
    visible: false,
  });

  const handleMouseMove = (e) => {
    // bounds return object with have info about elment in viewport like  width, height, top, left,
    const bounds = imgRef.current.getBoundingClientRect();

    // client return mouse position in viewport
    // client and bounds return position according to the viewport
    const x = ((e.clientX - bounds.left ) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top ) / bounds.height) * 100;

    const relativeX = e.clientX - bounds.left;
    const relativeY = e.clientY - bounds.top;

    setZoomPosition({
      x: relativeX +30, // small offset to the right
      y: relativeY +20, // small offset below
    });

    setZoomData({
      backgroundPosition: `${x}% ${y}%`,
      visible: true,
    });
  };

  const handleMouseLeave = () => {
    setZoomData({
      ...zoomData,
      visible: false,
    });
  };

  return (
    <div className="flex gap-4 relative">
      {/* Main Image */}
      <div
        className="flex justify-center items-center w-80 h-80 overflow-hidden  
          rounded-lg"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img ref={imgRef} src={src} alt={name} className="max-h-full rounded-lg" />
      </div>

      {/* Zoom Box */}
      {zoomData.visible && (
        <div
          className={`absolute w-50 h-50 rounded-lg sm:w-60 sm:h-60 lg:w-80 lg:h-80 
            shadow-[0_0_10px_rgba(0,0,0,0.3)]  bg-no-repeat bg-cover`}
          style={{
            left: `${zoomPosition.x}px`,
            top: `${zoomPosition.y}px`,
            backgroundImage: `url(${src})`,
            backgroundPosition: zoomData.backgroundPosition,
            backgroundSize: "200%", // zoom 2x
          }}
        ></div>
      )}
    </div>
  );
}
