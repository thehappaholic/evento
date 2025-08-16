import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    let token = req.cookies.token;

    // Also support Bearer Token from Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.json({ success: false, message: "Unauthorized access, login again" });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        
        if(tokenDecode.id){
            req.body = req.body || {};
            req.body.userId = tokenDecode.id;

        }
        else{
            return res.json({ success: false, message: "Unauthorized access, login again" });
        }
        next();

    } catch (error) {
        return res.json({ success: false, message: "Invalid token" });
    }
};

export default userAuth;
// middleware/userAuth.js
export const requireAuth = (req, res, next) => {
    // your auth middleware code
    next();
};

