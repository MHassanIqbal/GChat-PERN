import jwt from 'jsonwebtoken';
const GenerateToken = (userId, response) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });
    response.cookie("jwt", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000, // MS,
        httpOnly: true, // prevent XSS cross site scripting
        sameSite: "strict", // CSRF attack cross-site request forgery
        secure: process.env.NODE_ENV !== "development", // HTTPS
    });
    return token;
};
export default GenerateToken;
