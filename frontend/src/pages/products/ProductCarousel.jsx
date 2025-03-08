import { useGetTopProductsQuery } from "../../redux/apis/productApiSlice";
import Message from "../../components/Message";
import Slider from "react-slick";
import  "slick-carousel/slick/slick.css"
import  "slick-carousel/slick/slick-theme.css"
import moment from "moment";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore
} from 'react-icons/fa'
export default function ProductCarousel() {
  const { data: products, isLoading, error } = useGetTopProductsQuery()
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrow : true,
    autoplay: true,
    autoplaySpeed: 2000
  };


  return (
    <div className="mb-2 p-2 ">
      {isLoading ? null : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <Slider
          {...settings}
          className=" w-full   mx-auto xl:w-[40rem] lg:w-[40rem] sm:block "
        >
          {products.data.products.map((product) => (
            <div key={product._id}>
              <img
                src={product.img}
                alt={product.name}
                className="w-full rounded-lg object-cover h-[27rem]"
              />
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}
