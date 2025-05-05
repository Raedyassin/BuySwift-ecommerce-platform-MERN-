import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import {
  savePaymentMethod,
  saveShippingAddress,
} from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import ProgressSteps from "../../components/ProgressSteps";
import PaymentShow from "../../components/PaymentShow";

export default function Shipping() {
  const [paymentMethod, setPaymentMethod] = useState("OnDelivery");
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

  useEffect(() => {
    window.document.title = "Shipping";
        window.scrollTo(0, 0);

  }, []);

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
    <>
    <div className="w-full px-4 py-6 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <ProgressSteps step1 step2 step3={false} />
        <div className="mt-6">
          <form className="bg-white shadow-lg rounded-xl p-4 sm:p-6 w-full">
            <h1
              className="text-xl  sm:text-2xl font-bold mb-4 sm:mb-6 
              bg-gradient-to-r from-indigo-500 to-purple-300 bg-clip-text text-transparent"
            >
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
                    className="w-full p-2 sm:p-3 border border-gray-200 
                    rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-indigo-500 transition-all duration-200 
                    bg-gray-50 hover:bg-white text-sm sm:text-base"
                  />
                </div>
              ))}
            </div>

            {/* Payment Method */}
            <div className="mt-6">
              <h2
                className="text-base sm:text-lg font-semibold mb-3 italic
              bg-gradient-to-r from-indigo-500 to-purple-300 bg-clip-text text-transparent
              "
              >
                Payment Method
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {/* 'VodafoneCash', 'PayPal', 'OnDelivery' */}
                {/* onDelivery */}
                <label
                  htmlFor="OnDelivery"
                  className="flex items-center text-[#49C219] space-x-2 sm:space-x-3 cursor-pointer
                    p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <input
                    type="radio"
                    id="OnDelivery"
                    value="OnDelivery"
                    checked={paymentMethod === "OnDelivery"}
                    name="OnDelivery"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[#49C219] focus:ring-[#49C219]
                      border-gray-300 cursor-pointer accent-[#49C219] "
                  />
                  <PaymentShow paymentMethod={"OnDelivery"} />
                </label>

                {/* PayPal */}
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
                    className="w-4 h-4 text-[#179BD7] focus:ring-[#179BD7]
                      border-gray-300 cursor-pointer accent-[#179BD7] "
                  />
                  <PaymentShow paymentMethod={"PayPal"} />
                </label>

                {/* VodafoneCash */}
                <label
                  htmlFor="VodafoneCash"
                    className="flex items-center space-x-2 sm:space-x-1 cursor-pointer 
                  p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 
                  flex-wrap gap-1"
                >
                  <input
                    type="radio"
                    id="VodafoneCash"
                    value="VodafoneCash"
                    checked={paymentMethod === "VodafoneCash"}
                    name="VodafoneCash"
                    // onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-[#cc2131] focus:ring-[#cc2131] 
                      border-gray-300 cursor-pointer accent-[#cc2131]"
                  />
                  <PaymentShow paymentMethod={"VodafoneCash"} />
                  <span className="text-xs text-gray-500">
                    (will be{" "}
                    <span className="font-bold text-[#cc2131]">added</span> in
                    the <span className="font-bold text-[#cc2131]">future</span>
                    )
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
                      className="w-4 h-4 text-indigo-500 focus:ring-indigo-500 border-gray-300 cursor-pointer"
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
              className="mt-6 w-full cursor-pointer 
                text-white py-3 px-4 rounded-lg font-semibold  text-sm sm:text-base
                bg-gradient-to-r from-indigo-600 to-purple-600 
                hover:from-indigo-700 hover:to-purple-700 transition-colors 
                duration-300
                "
            >
              Continue to Payment
            </button>
          </form>
        </div>
      </div>
      </div>
    </>
  );
}
