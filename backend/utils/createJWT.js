import jwt from "jsonwebtoken";

const generateJWT = (res,userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SEKRYT, { expiresIn: "1d" });
  // set jwt is HTTP-ONLY cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_EMV !== "develpment",
    sameSite: "strict",
    // You need to change sameSite to "none" because your frontend and backend are 
    // on different domains, which is called a cross- site request.
    // sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000
  })
}

export default generateJWT;