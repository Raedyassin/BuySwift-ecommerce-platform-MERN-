import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Ratings from "./Ratings";
import { useNavigate } from "react-router";

// Custom Next Arrow
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 right-[-1rem] sm:right-[-1.5rem] lg:right-[-2rem] z-10"
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <div
        className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center 
        hover:bg-indigo-700 hover:shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer"
      >
        <svg
          className="w-5 h-5"
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
  );
};

// Custom Prev Arrow
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 left-[-1rem] sm:left-[-1.5rem] lg:left-[-2rem] z-10"
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <div
        className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center 
        hover:bg-indigo-700 hover:shadow-lg hover:scale-110 transition-all duration-300 cursor-pointer"
      >
        <svg
          className="w-5 h-5"
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
  );
};

export default function RelatedProducts({ relatedProducts }) {
  const products = relatedProducts?.data?.data?.products || [];
  const baseSlidesToShow = Math.min(
    5,
    products?.length || 1
  );
  const shouldShowArrows =
    products?.length > baseSlidesToShow;

  const settings = {
    dots: false,
    speed: 500,
    infinite: false,
    arrows: shouldShowArrows,
    slidesToShow: baseSlidesToShow,
    centerMode: false,
    variableWidth: !shouldShowArrows,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: Math.min(
            4,
            products?.length || 1
          ),
          arrows:
            products?.length >
            Math.min(4, products?.length || 1),
          variableWidth:
            products?.length <=
            Math.min(4, products?.length || 1),
        },
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: Math.min(
            3,
            products?.length || 1
          ),
          arrows:
            products?.length >
            Math.min(3, products?.length || 1),
          variableWidth:
            products?.length <=
            Math.min(3, products?.length || 1),
        },
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: Math.min(
            2,
            products?.length || 1
          ),
          arrows:
            products?.length >
            Math.min(2, products?.length || 1),
          variableWidth:
            products?.length <=
            Math.min(2, products?.length || 1),
        },
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: Math.min(
            2,
            products?.length || 1
          ),
          arrows:
            products?.length >
            Math.min(2, products?.length || 1),
          variableWidth:
            products?.length <=
            Math.min(2, products?.length || 1),
        },
      },
      {
        breakpoint: 480, // Below sm
        settings: {
          slidesToShow: 1,
          arrows: products?.length > 1,
          variableWidth: products?.length <= 1,
        },
      },
    ],
  };

  const navigate = useNavigate();

  return (
    <div className="relative px-8">
      <Slider {...settings} className="w-full">
        {products?.map((product) => (
          <div key={product._id} className=" focus:outline-none ml-1">
            <div
              className="group relative w-42 sm:w-51 md:w-53.5  px-2  h-56 sm:h-64 md:h-72 
              bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 
              hover:shadow-lg hover:scale-105 cursor-pointer"
            >
              <div className="w-full h-full  flex justify-center items-center">
                <img
                  src={"/uploads/" + product.img.split("/").pop()}
                  alt={product?.name}
                  className=" max-h-full rounded-lg"
                />
              </div>
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/70
                via-black/30 to-transparent opacity-0 group-hover:opacity-100 
                transition-opacity duration-300 flex flex-col 
                items-center justify-center p-4"
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <h3 className="text-white text-sm sm:text-base md:text-lg font-semibold text-center">
                  {product.name.length > 15
                    ? product.name.slice(0, 15) + "..."
                    : product.name}
                </h3>
                <p className="text-white text-sm sm:text-base font-medium mt-1">
                  ${product.price}
                </p>
                <p className="text-white text-xs sm:text-sm font-medium mt-1">
                  {product.brand}
                </p>
                {/* <div className="ml-5">
                  </div> */}
                <Ratings
                  rating={product.rating}
                  text={``}
                  className="text-yellow-400  text-xs sm:text-sm mt-2"
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
