  import { useState, useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { SiVodafone } from "react-icons/si";
  import { useNavigate } from "react-router";
  import {
    savePaymentMethod,
    saveShippingAddress,
  } from "../../redux/features/cart/cartSlice";
  import { toast } from "react-toastify";
  import ProgressSteps from "../../components/ProgressSteps";

  export default function Shipping() {
    const [paymentMethod, setPaymentMethod] = useState("PayPal");
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [address, setAddress] = useState(shippingAddress?.address || "");
    const [city, setCity] = useState(shippingAddress?.city || "");
    const [postalCode, setPostalCode] = useState(
      shippingAddress?.postalCode || ""
    );
    const [firstPhone, setFirstPhone] = useState(
      shippingAddress?.firstPhone || ""
    );
    const [secondPhone, setSecondPhone] = useState(
      shippingAddress?.secondPhone || ""
    );
    const [country, setCountry] = useState(shippingAddress?.country || "");

    useEffect(() => {
      if (!shippingAddress.address) {
        navigate("/shipping");
      }
    }, [shippingAddress, navigate]);

    const shippingSubmitHandler = (e) => {
      e.preventDefault();
      if (
        !address ||
        !city ||
        !postalCode ||
        !country ||
        !firstPhone ||
        firstPhone === secondPhone
      ) {
        toast.error("Please enter shipping information");
        return;
      }
      dispatch(savePaymentMethod(paymentMethod));
      dispatch(
        saveShippingAddress({
          address,
          city,
          postalCode,
          country,
          firstPhone,
          secondPhone,
        })
      );
      navigate("/placeorder");
    };

    return (
      <div className="w-full px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <ProgressSteps step1 step2 step3={false} />
          <div className="mt-6">
            <form className="bg-white shadow-lg rounded-xl p-4 sm:p-6 w-full">
              <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Shipping Details
              </h1>

              {/* Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    id: "address",
                    label: "Address",
                    value: address,
                    setter: setAddress,
                    placeholder: "Enter your address",
                  },
                  {
                    id: "city",
                    label: "City",
                    value: city,
                    setter: setCity,
                    placeholder: "Enter your city",
                  },
                  {
                    id: "postalCode",
                    label: "Postal Code",
                    value: postalCode,
                    setter: setPostalCode,
                    placeholder: "Enter postal code",
                  },
                  {
                    id: "country",
                    label: "Country",
                    value: country,
                    setter: setCountry,
                    placeholder: "Enter your country",
                  },
                  {
                    id: "firstPhone",
                    label: "Phone Number",
                    value: firstPhone,
                    setter: setFirstPhone,
                    placeholder: "Enter your phone (required)",
                  },
                  {
                    id: "secondPhone",
                    label: "Second Phone Number",
                    value: secondPhone,
                    setter: setSecondPhone,
                    placeholder: "Enter second phone (optional)",
                  },
                ].map((field) => (
                  <div key={field.id} className="flex flex-col">
                    <label
                      htmlFor={field.id}
                      className="text-sm font-medium text-gray-700 mb-1"
                    >
                      {field.label}
                    </label>
                    <input
                      type="text"
                      id={field.id}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 bg-gray-50 hover:bg-white text-sm sm:text-base"
                    />
                  </div>
                ))}
              </div>

              {/* Payment Method */}
              <div className="mt-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                  Payment Method
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  <label
                    htmlFor="PayPal"
                    className="flex items-center space-x-2 sm:space-x-3 cursor-pointer
                    p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <input
                      type="radio"
                      id="PayPal"
                      value="PayPal"
                      checked={paymentMethod === "PayPal"}
                      name="PayPal"
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-pink-500 focus:ring-pink-500
                      border-gray-300 cursor-pointer accent-pink-500 "
                    />
                    <svg
                      className="w-16 sm:w-20 h-4 sm:h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 124 40"
                    >
                      <path
                        fill="#253B80"
                        d="M46.211,6.749h-6.839c-0.468,0-0.866,0.34-0.939,0.802l-2.766,17.537c-0.055,0.346,0.213,0.658,0.564,0.658h3.265c0.468,0,0.866-0.34,0.939-0.803l0.746-4.73c0.072-0.463,0.471-0.803,0.938-0.803h2.165c4.505,0,7.105-2.18,7.784-6.5c0.306-1.89,0.013-3.375-0.872-4.415C50.224,7.353,48.5,6.749,46.211,6.749z M47,13.154c-0.374,2.454-2.249,2.454-4.062,2.454h-1.032l0.724-4.583c0.043-0.277,0.283-0.481,0.563-0.481h0.473c1.235,0,2.4,0,3.002,0.704C47.027,11.668,47.137,12.292,47,13.154z"
                      />
                      <path
                        fill="#253B80"
                        d="M66.654,13.075h-3.275c-0.279,0-0.52,0.204-0.563,0.481l-0.145,0.916l-0.229-0.332c-0.709-1.029-2.29-1.373-3.868-1.373c-3.619,0-6.71,2.741-7.312,6.586c-0.313,1.918,0.132,3.752,1.22,5.031c0.998,1.176,2.426,1.666,4.125,1.666c2.916,0,4.533-1.875,4.533-1.875l-0.146,0.91c-0.055,0.348,0.213,0.66,0.562,0.66h2.95c0.469,0,0.865-0.34,0.939-0.803l1.77-11.209C67.271,13.388,67.004,13.075,66.654,13.075z M62.089,19.449c-0.316,1.871-1.801,3.127-3.695,3.127c-0.951,0-1.711-0.305-2.199-0.883c-0.484-0.574-0.668-1.391-0.514-2.301c0.295-1.855,1.805-3.152,3.67-3.152c0.93,0,1.686,0.309,2.184,0.892C62.034,17.721,62.232,18.543,62.089,19.449z"
                      />
                      <path
                        fill="#253B80"
                        d="M84.096,13.075h-3.291c-0.314,0-0.609,0.156-0.787,0.417l-4.539,6.686l-1.924-6.425c-0.121-0.402-0.492-0.678-0.912-0.678h-3.234c-0.393,0-0.666,0.384-0.541,0.754l3.625,10.638l-3.408,4.811c-0.268,0.379,0.002,0.9,0.465,0.9h3.287c0.312,0,0.604-0.152,0.781-0.408L84.564,13.97C84.826,13.592,84.557,13.075,84.096,13.075z"
                      />
                      <path
                        fill="#179BD7"
                        d="M94.992,6.749h-6.84c-0.467,0-0.865,0.34-0.938,0.802l-2.766,17.537c-0.055,0.346,0.213,0.658,0.562,0.658h3.51c0.326,0,0.605-0.238,0.656-0.562l0.785-4.971c0.072-0.463,0.471-0.803,0.938-0.803h2.164c4.506,0,7.105-2.18,7.785-6.5c0.307-1.89,0.012-3.375-0.873-4.415C99.004,7.353,97.281,6.749,94.992,6.749z M95.781,13.154c-0.373,2.454-2.248,2.454-4.062,2.454h-1.031l0.725-4.583c0.043-0.277,0.281-0.481,0.562-0.481h0.473c1.234,0,2.4,0,3.002,0.704C95.809,11.668,95.918,12.292,95.781,13.154z"
                      />
                      <path
                        fill="#179BD7"
                        d="M115.434,13.075h-3.273c-0.281,0-0.52,0.204-0.562,0.481l-0.145,0.916l-0.23-0.332c-0.709-1.029-2.289-1.373-3.867-1.373c-3.619,0-6.709,2.741-7.311,6.586c-0.312,1.918,0.131,3.752,1.219,5.031c1,1.176,2.426,1.666,4.125,1.666c2.916,0,4.533-1.875,4.533-1.875l-0.146,0.91c-0.055,0.348,0.213,0.66,0.564,0.66h2.949c0.467,0,0.865-0.34,0.938-0.803l1.771-11.209C116.053,13.388,115.785,13.075,115.434,13.075z M110.869,19.449c-0.314,1.871-1.801,3.127-3.695,3.127c-0.949,0-1.711-0.305-2.199-0.883c-0.484-0.574-0.666-1.391-0.514-2.301c0.297-1.855,1.805-3.152,3.67-3.152c0.93,0,1.686,0.309,2.184,0.892C110.816,17.721,111.014,18.543,110.869,19.449z"
                      />
                      <path
                        fill="#179BD7"
                        d="M119.295,7.23l-2.807,17.858c-0.055,0.346,0.213,0.658,0.562,0.658h2.822c0.469,0,0.867-0.34,0.939-0.803l2.768-17.536c0.055-0.346-0.213-0.659-0.562-0.659h-3.16C119.578,6.749,119.338,6.953,119.295,7.23z"
                      />
                      <path
                        fill="#253B80"
                        d="M7.266,29.154l0.523-3.322l-1.165-0.027H1.061L4.927,1.292C4.939,1.218,4.978,1.149,5.035,1.1c0.057-0.049,0.13-0.076,0.206-0.076h9.38c3.114,0,5.263,0.648,6.385,1.927c0.526,0.6,0.861,1.227,1.023,1.917c0.17,0.724,0.173,1.589,0.007,2.644l-0.012,0.077v0.676l0.526,0.298c0.443,0.235,0.795,0.504,1.065,0.812c0.45,0.513,0.741,1.165,0.864,1.938c0.127,0.795,0.085,1.741-0.123,2.812c-0.24,1.232-0.628,2.305-1.152,3.183c-0.482,0.809-1.096,1.48-1.825,2c-0.696,0.494-1.523,0.869-2.458,1.109c-0.906,0.236-1.939,0.355-3.072,0.355h-0.73c-0.522,0-1.029,0.188-1.427,0.525c-0.399,0.344-0.663,0.814-0.744,1.328l-0.055,0.299l-0.924,5.855l-0.042,0.215c-0.011,0.068-0.03,0.102-0.058,0.125c-0.025,0.021-0.061,0.035-0.096,0.035H7.266z"
                      />
                      <path
                        fill="#179BD7"
                        d="M23.048,7.667L23.048,7.667L23.048,7.667c-0.028,0.179-0.06,0.362-0.096,0.55c-1.237,6.351-5.469,8.545-10.874,8.545H9.326c-0.661,0-1.218,0.48-1.321,1.132l0,0l0,0L6.596,26.83l-0.399,2.533c-0.067,0.428,0.263,0.814,0.695,0.814h4.881c0.578,0,1.069-0.42,1.16-0.99l0.048-0.248l0.919-5.832l0.059-0.32c0.09-0.572,0.582-0.992,1.16-0.992h0.73c4.729,0,8.431-1.92,9.513-7.476c0.452-2.321,0.218-4.259-0.978-5.622C24.022,8.286,23.573,7.945,23.048,7.667z"
                      />
                      <path
                        fill="#222D65"
                        d="M21.754,7.151c-0.189-0.055-0.384-0.105-0.584-0.15c-0.201-0.044-0.407-0.083-0.619-0.117c-0.742-0.12-1.555-0.177-2.426-0.177h-7.352c-0.181,0-0.353,0.041-0.507,0.115C9.927,6.985,9.675,7.306,9.614,7.699L8.05,17.605l-0.045,0.289c0.103-0.652,0.66-1.132,1.321-1.132h2.752c5.405,0,9.637-2.195,10.874-8.545c0.037-0.188,0.068-0.371,0.096-0.55c-0.313-0.166-0.652-0.308-1.017-0.429C21.941,7.208,21.848,7.179,21.754,7.151z"
                      />
                      <path
                        fill="#253B80"
                        d="M9.614,7.699c0.061-0.393,0.313-0.714,0.652-0.876c0.155-0.074,0.326-0.115,0.507-0.115h7.352c0.871,0,1.684,0.057,2.426,0.177c0.212,0.034,0.418,0.073,0.619,0.117c0.2,0.045,0.395,0.095,0.584,0.15c0.094,0.028,0.187,0.057,0.278,0.086c0.365,0.121,0.704,0.264,1.017,0.429c0.368-2.347-0.003-3.945-1.272-5.392C20.378,0.682,17.853,0,14.622,0h-9.38c-0.66,0-1.223,0.48-1.325,1.133L0.01,25.898c-0.077,0.49,0.301,0.932,0.795,0.932h5.791l1.454-9.225L9.614,7.699z"
                      />
                    </svg>
                  </label>

                  <label
                    htmlFor="Vodafone"
                    className="flex items-center space-x-2 sm:space-x-1 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-wrap gap-1"
                  >
                    <input
                      type="radio"
                      id="Vodafone"
                      value="Vodafone"
                      checked={paymentMethod === "Vodafone"}
                      name="Vodafone"
                      onChange={() => setPaymentMethod("PayPal")}
                      className="w-4 h-4 text-pink-500 focus:ring-pink-500 
                      border-gray-300 cursor-pointer accent-pink-500"
                    />
                    <SiVodafone className="w-5 h-5 text-[#cc2131]" />
                    <span className="text-sm font-medium text-[#cc2131] italic">
                      Vodafone Cash
                    </span>
                    <span className="text-xs text-gray-500">
                      (will be{" "}
                      <span className="font-bold text-[#cc2131]">added</span> in
                      the{" "}
                      <span className="font-bold text-[#cc2131]">future</span>)
                    </span>
                  </label>

                  {/* visa card */}
                  {/* <label
                    htmlFor="Visa"
                    className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-wrap gap-1"
                  >
                    <input
                      type="radio"
                      id="Visa"
                      value="Visa"
                      checked={paymentMethod === "Visa"}
                      name="Visa"
                      onChange={() => setPaymentMethod("PayPal")}
                      className="w-4 h-4 text-pink-500 focus:ring-pink-500 border-gray-300 cursor-pointer"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="45px"
                      height="16px"
                      className="sm:w-[55px] sm:h-[20px]"
                      viewBox="0 0 180 160"
                    >
                      <path fill="#fff" d="M0 0h192.756v192.756H0V0z" />
                      <path
                        fill="#1d5b99"
                        d="M181.266 155.531H8.504V37.225h175.748V155.531h-2.986z"
                      />
                      <path
                        fill="#fff"
                        d="M181.266 152.545H11.49V40.211h169.776v112.334z"
                      />
                      <path
                        fill="#1d5b99"
                        d="M72.851 114.621l11.026-36.355h9.838l-11.027 36.355h-9.837zM68.453 78.276l-8.85 15.412c-2.252 4.037-3.57 6.076-4.203 8.625h-.135c.157-3.232-.294-7.203-.336-9.447l-.978-14.59h-16.56l-.169.978c4.254 0 6.777 2.137 7.471 6.509l3.228 28.858h10.192l20.609-36.345H68.453zM144.959 114.621l-.271-5.406-12.283-.01-2.514 5.416h-10.68l19.367-36.286h13.109l3.279 36.286h-10.007zm-1.127-21.445c-.111-2.687-.201-6.333-.02-8.541h-.145c-.598 1.805-3.17 7.225-4.301 9.89l-3.66 7.968h8.625l-.499-9.317zM104.043 115.654c-6.945 0-11.555-2.203-14.845-4.168l4.686-7.156c2.955 1.652 5.274 3.559 10.612 3.559 1.715 0 3.369-.445 4.309-2.072 1.367-2.363-.316-3.637-4.158-5.812l-1.898-1.234c-5.697-3.892-8.162-7.59-5.48-14.044 1.717-4.128 6.242-7.258 13.711-7.258 5.148 0 9.977 2.228 12.789 4.404l-5.387 6.318c-2.746-2.22-5.021-3.343-7.625-3.343-2.076 0-3.654.801-4.199 1.881-1.025 2.03.332 3.414 3.326 5.272l2.256 1.436c6.918 4.363 8.564 8.937 6.832 13.212-2.984 7.363-8.822 9.005-14.929 9.005zM157.895 83.193h-.426v-2.594h.984c.627 0 .945.219.945.746 0 .47-.287.665-.676.708l.727 1.14h-.482l-.67-1.108h-.402v1.108zm.476-1.473c.32 0 .602-.031.602-.407 0-.313-.307-.351-.562-.351h-.516v.758h.476zm-.012 2.476c-1.348 0-2.307-1.009-2.307-2.344 0-1.409 1.064-2.343 2.307-2.343 1.227 0 2.293.934 2.293 2.343 0 1.41-1.066 2.344-2.293 2.344zm0-4.28c-1.016 0-1.805.796-1.805 1.936 0 1.065.689 1.936 1.805 1.936 1.002 0 1.791-.79 1.791-1.936 0-1.14-.789-1.936-1.791-1.936z"
                      />
                      <path
                        fill="#e7a83a"
                        d="M177.086 125.912H15.969v21.557h161.117v-21.557z"
                      />
                      <path
                        fill="#1d5b99"
                        d="M176.787 45.586H15.671v21.558h161.116V45.586zM173.105 145.936h-.426v-2.594h.984c.627 0 .945.219.945.746 0 .469-.287.664-.676.707l.727 1.141h-.482l-.67-1.109h-.402v1.109zm.477-1.473c.32 0 .602-.031.602-.408 0-.312-.307-.35-.562-.35h-.516v.758h.476zm-.012 2.475c-1.348 0-2.307-1.008-2.307-2.344 0-1.408 1.066-2.342 2.307-2.342 1.229 0 2.293.934 2.293 2.342 0 1.41-1.064 2.344-2.293 2.344zm0-4.28c-1.016 0-1.805.797-1.805 1.936 0 1.066.689 1.936 1.805 1.936 1.002 0 1.791-.789 1.791-1.936 0-1.139-.789-1.936-1.791-1.936z"
                      />
                    </svg>
                    <span className="text-xs text-gray-500">
                      (will be{" "}
                      <span className="font-bold text-[#cc2131]">added</span> in
                      the <span className="font-bold text-[#cc2131]">future</span>
                      )
                    </span>
                  </label> */}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                onClick={(e) => shippingSubmitHandler(e)}
                className="mt-6 w-full cursor-pointer bg-gradient-to-r from-pink-600 to-purple-600 text-white py-2 sm:py-3 px-4 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 text-sm sm:text-base"
              >
                Continue to Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
