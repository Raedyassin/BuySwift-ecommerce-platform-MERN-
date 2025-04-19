import { useGetClientIdPayPalQuery } from "../redux/apis/paymentApiSlice";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// the PayPalWraper is a wrapper for the PayPalScriptProvider on all application
export default function PayPalWraper({ children }) {
    const { data } = useGetClientIdPayPalQuery();

  // deferLoading={true} the default is false mean load it immediately when render
  // The PayPal SDK does not load when <PayPalScriptProvider> renders.
  // The <PayPalButtons /> will not appear until the script is manually loaded later.
  return (
    <PayPalScriptProvider
      deferLoading={true}
      options={{ "client-id": data?.clientId || "test", currency: "USD", intent: "capture" }}
    >
      {children}
    </PayPalScriptProvider>
  );
}
