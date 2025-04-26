import { useRef, useState } from "react";

export default function ZoomImage({ src }) {
  const imgRef = useRef(null);
  const [zoomData, setZoomData] = useState({
    backgroundPosition: "0% 0%",
    visible: false,
  });

  const handleMouseMove = (e) => {
    const bounds = imgRef.current.getBoundingClientRect();

    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;

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
        className="relative w-80 h-80 overflow-hidden  rounded-lg"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img ref={imgRef} src={src} alt="product" className="max-h-full" />
      </div>

      {/* Zoom Box */}
      {zoomData.visible && (
        <div
          className={`absolute top-0 -right-100 w-80 h-80 
            shadow-[0_0_10px_rgba(0,0,0,0.3)] rounded-lg bg-no-repeat bg-cover`}
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: zoomData.backgroundPosition,
            backgroundSize: "200%", // zoom 2x
          }}
        ></div>
      )}
    </div>
  );
}
