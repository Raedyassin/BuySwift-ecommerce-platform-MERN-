import axios from "axios";
// The generateAccessToken function is a key part of your backend’s interaction 
// with PayPal. It sends a specific request to PayPal’s token endpoint to obtain
// an access token, which your app then uses to authenticate other PayPal API calls
// (like creating or capturing orders). Here’s the detailed process:
export const generateAccessToken = async () => {
  // Generate PayPal access token
  const auth = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString("base64");
  try {
    const response = await axios.post(
      `${process.env.BASE_PAYPAL_URL}/v1/oauth2/token`,
      "grant_type=client_credentials", // Payload: Requesting client credentials grant
      {
        headers: {
          Authorization: `Basic ${auth}`, // Basic Auth with clientId:secret
          "Content-Type": "application/x-www-form-urlencoded", // Required by PayPal
        },
      }
    )
    return response.data.access_token;
  }catch (err) {
    console.error("Error generating PayPal access token:", err.response?.data || err.message);
    throw new Error("Failed to generate PayPal access token");
  }
}