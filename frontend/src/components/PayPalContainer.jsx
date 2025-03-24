import {
  FUNDING,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";
import {
  usePaypalPaymentMutation,
  usePaypalPaymentCaptureMutation,
  useGetClientIdPayPalQuery,
} from "../redux/apis/paymentApiSlice";
import Loader from "./Loader";
import { toast } from "react-toastify";
export default function PayPalContainer({ refetch, order }) {
  const [, dispatchPayPal] = usePayPalScriptReducer();
  const [message, setMessage] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const { data: clientInfo } = useGetClientIdPayPalQuery();
  useEffect(() => {
    if (!window.paypal) {
      dispatchPayPal(
        // actionType: "resetOptions", will reset the options so
        // you should put all obtions again here so i will use setLoadingStatus
        // { type: "setLoadingStatus", value: "pending" }
        {
          type: "resetOptions",
          value: {
            "client-id": clientInfo?.clientId || "test",
            currency: "USD",
            intent: "capture",
          },
        }
      );
    }
  }, [dispatchPayPal, clientInfo]);

  const [createPayPalPayment] = usePaypalPaymentMutation();
  const [payPalPaymentCapture] = usePaypalPaymentCaptureMutation();
  // the createOrder is call the backend adn return the paypal order ID this is functionality
  const createOrder = async (data, actions) => {
    try {
      setPaymentStatus("loading");
      const response = await createPayPalPayment(order.data.order._id).unwrap();
      setMessage("Order prepared for payment...");
      return response?.data?.paypalOrderId; // Return PayPal order ID to PayPalButtons
    } catch (error) {
      if (error.status === 409) {
        toast.info(error.data.message);
        setPaymentStatus("pending");
        return;
      }
      console.log("error", error);
      console.error("Error creating order:", error && error.message);
      setMessage("Failed to create order. Please try again.");
      setPaymentStatus("error");
      toast.error("Failed to create order. Please try again.");
      throw error;
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const captureResponse = await payPalPaymentCapture({
        id: order.data.order._id,
        paypalOrderId: data.orderID,
      }).unwrap();
      console.log("captureResponse", captureResponse);
      if (captureResponse.status === "success") {
        setMessage(`Payment completed successfully`);
        toast.success(`Payment completed successfully`);
        setPaymentStatus("success");
        refetch();
      } else {
        setMessage("Payment failed. Please try again.");
        setPaymentStatus("error");
        throw new Error(captureResponse.message);
      }
    } catch (error) {
      console.error("Capture Error:", error);
      message("Payment capture failed. Please try again or contact support.");
      toast.error(
        "Payment capture failed. Please try again or contact support."
      );
    }
  };
  const onCancel = (data) => {
    console.log("Payment cancelled:", data); // Log cancellation details
    setPaymentStatus("pending");
    setMessage("");
    toast.info("Payment was cancelled. You can try again if you'd like.");
  };

  // i'm load the JS SDK in the PlaceOrder.jsx component because the user when
  // enter to the placeOrder page the PaypalButton component will be rendered
  // because i'm use deferLoading={true} that don't load the SDK immediately
  return (
    <>
      <PayPalButtons
        style={{ layout: "vertical", color: "blue", tagline: false }}
        fundingSource={FUNDING.PAYPAL}
        deferLoading={false}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={(err) => console.error(err)}
        onCancel={onCancel}
      />
      {paymentStatus !== "pending" && (
        <div
          className={`text-center ${
            paymentStatus === "success" ? "text-green-400" : paymentStatus === "error" ? "text-red-400" : "text-blue-400"
          } flex items-center italic font-semibold`}
        >
          <div>{message}</div>
          <div>
            {paymentStatus === "loading" ? (
              <Loader />
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </>
  );
}
