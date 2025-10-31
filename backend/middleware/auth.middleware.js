// import User from "../model/user.model.js";
// import jwt from "jsonwebtoken";

// export  const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       const token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select("-password");
//       return next();
//     } catch (error) {
//         console.log(error)
//         return res.status(401).json({message: `Token Failed`})
//     }
//   }
//   return res.status(401).json({message: `Token Failed, Not Authorized`})
// };

import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    // Check for Authorization header
    if (!req.headers.authorization?.startsWith("Bearer")) {
      return res.status(401).json({ message: "Authorization header required" });
    }

    // Extract and verify token
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token and get user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error("Auth middleware error:", error);
    return res.status(500).json({ message: "Server authentication error" });
  }
};