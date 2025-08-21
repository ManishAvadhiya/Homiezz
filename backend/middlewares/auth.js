import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).json({ msg: "No token provided, authorization denied" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // Attach user info to request object
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Token is not valid" });
    }
}