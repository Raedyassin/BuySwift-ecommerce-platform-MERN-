import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Ratings from "./Ratings";
import { useNavigate } from "react-router";
import { useEffect, useRef } from "react";
import Loader from "../../components/Loader";

// Custom Next Arrow
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 right-[-1rem] sm:right-[-1.5rem] lg:right-[-28px] 
      w-12 sm:w-16 md:w-18 h-full bg-gradient-to-r from-[#e6e7e8]/0 to-[#070707]/40 text-white 
      rounded-r-xl flex items-center justify-center px-1 sm:px-2 z-10`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <div className="h-full flex items-center justify-center">
        <div
          className="w-8 sm:w-10 md:w-12 lg:w-14 h-8 sm:h-10 md:h-12 lg:h-14 
          bg-gradient-to-r from-[#0094D4] to-[#00C4B4] text-white rounded-full 
          hover:bg-gradient-to-l hover:from-[#0083d4] hover:to-[#00b3a3] hover:shadow-lg hover:scale-110 
          transition-all duration-300 cursor-pointer flex items-center justify-center"
        >
          <svg
            className="w-4 sm:w-5 md:w-6 lg:w-8 h-4 sm:h-5 md:h-6 lg:h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Custom Prev Arrow
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 left-[-1rem] sm:left-[-1.5rem] lg:left-[-28px] 
      w-12 sm:w-16 md:w-18 h-full bg-gradient-to-l from-[#e6e7e8]/0 to-[#070707]/40 text-white 
      rounded-l-xl flex items-center justify-center px-1 sm:px-2 z-10`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <div className="h-full flex items-center justify-center">
        <div
          className="w-8 sm:w-10 md:w-12 lg:w-14 h-8 sm:h-10 md:h-12 lg:h-14 
          bg-gradient-to-r from-[#0094D4] to-[#00C4B4] text-white rounded-full 
          hover:bg-gradient-to-l hover:from-[#0083d4] hover:to-[#00b3a3] hover:shadow-lg hover:scale-110 
          transition-all duration-300 cursor-pointer flex items-center justify-center"
        >
          <svg
            className="w-4 sm:w-5 md:w-6 lg:w-8 h-4 sm:h-5 md:h-6 lg:h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default function RelatedProducts({
  relatedProducts,
}) {

  const baseSlidesToShow = Math.min(
    5,
    relatedProducts?.data?.data?.products?.length || 1
  );
  const shouldShowArrows =
    relatedProducts?.data?.data?.products?.length > baseSlidesToShow;

  const settings = {
    dots: false,
    speed: 500,
    infinite: false,
    arrows: shouldShowArrows, // Show arrows only if products exceed slidesToShow
    slidesToShow: baseSlidesToShow,
    centerMode: false, // Disable centering for left alignment
    variableWidth: !shouldShowArrows, // True when arrows are hidden
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: Math.min(
            4,
            relatedProducts?.data?.data?.products?.length || 1
          ),
          arrows:
            relatedProducts?.data?.data?.products?.length >
            Math.min(4, relatedProducts?.data?.data?.products?.length || 1),
          variableWidth:
            relatedProducts?.data?.data?.products?.length <=
            Math.min(4, relatedProducts?.data?.data?.products?.length || 1),
        },
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: Math.min(
            3,
            relatedProducts?.data?.data?.products?.length || 1
          ),
          arrows:
            relatedProducts?.data?.data?.products?.length >
            Math.min(3, relatedProducts?.data?.data?.products?.length || 1),
          variableWidth:
            relatedProducts?.data?.data?.products?.length <=
            Math.min(3, relatedProducts?.data?.data?.products?.length || 1),
        },
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: Math.min(
            2,
            relatedProducts?.data?.data?.products?.length || 1
          ),
          arrows:
            relatedProducts?.data?.data?.products?.length >
            Math.min(2, relatedProducts?.data?.data?.products?.length || 1),
          variableWidth:
            relatedProducts?.data?.data?.products?.length <=
            Math.min(2, relatedProducts?.data?.data?.products?.length || 1),
        },
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: Math.min(
            2,
            relatedProducts?.data?.data?.products?.length || 1
          ),
          arrows:
            relatedProducts?.data?.data?.products?.length >
            Math.min(2, relatedProducts?.data?.data?.products?.length || 1),
          variableWidth:
            relatedProducts?.data?.data?.products?.length <=
            Math.min(2, relatedProducts?.data?.data?.products?.length || 1),
        },
      },
      {
        breakpoint: 480, // Below sm
        settings: {
          slidesToShow: 1,
          arrows: relatedProducts?.data?.data?.products?.length > 1,
          variableWidth: relatedProducts?.data?.data?.products?.length <= 1,
        },
      },
    ],
  };

  const navigate = useNavigate();
  return (
    <div className="relative px-4 ">
      <Slider {...settings} className="w-full">
        {relatedProducts?.data?.data?.products?.map((product) => (
          <div
            key={product._id}
            className="relative max-w-70 h-36 sm:h-44 lg:h-50 px-1 sm:px-2 focus:outline-none"
          >
              <>
                <img
                  src={"/uploads/" + product.img.split("/").pop()}
                  alt={product?.name.slice(0, 10)}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div
                  onClick={() => {
                    navigate(`/product/${product._id}`);
                  }}
                  className="md:hidden italic font-bold text-gray-600 text-center 
                    w-full cursor-pointer hover:text-pink-700 transition-colors duration-300"
                >
                  {product.name.length > 10
                    ? product.name.slice(0, 10) + "..."
                    : product.name}
                </div>
                <div
                  className="absolute p-1 sm:p-2 px-2 sm:px-4 cursor-pointer top-0 left-0 w-full h-full flex 
                items-center justify-center flex-col rounded-lg bg-transparent 
                hover:bg-gradient-to-b  hover:from-gray-200/50 hover:to-black/50 group"
                  onClick={() => {
                    navigate(`/product/${product._id}`);
                  }}
                >
                  <div className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {product.name.length > 10
                      ? product.name.slice(0, 10) + "..."
                      : product.name}
                  </div>
                  <div className="text-white text-sm sm:text-base md:text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {"$" + product.price}
                  </div>
                  <div className="text-white text-sm sm:text-base md:text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {product.brand}
                  </div>
                  <Ratings
                    rating={product.rating}
                    text={``}
                    className="justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs sm:text-sm md:text-base"
                  />
                </div>
              </>
          </div>
        ))}
      </Slider>
    </div>
  );
}
