import User from "../models/user.js";
import { generateToken } from "../tools/auth.tools.js";

const setCookies = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user);
      setCookies(res, token);
      return res.json({ msg: "Login successful", user: user });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {}
};
export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;


    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Create new user
    user = new User({ email, password, name });
    await user.save();

    // Generate token
    const token = generateToken(user);

    //set cookie
    setCookies(res, token);

    res.json({
      msg: "User registered successfully",user: user
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const logout = async (req,res)=>{
    try {
      res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({message:"server error" , error:error.message});
  }
}

export const profile = async (req, res) => {
  try {

    const userId = req.user?.id;
    
    const user = await User.findById(userId)

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user profile:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
}