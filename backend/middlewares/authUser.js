import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    try {
        const {token} = req.headers
        
        if (!token) {
            return res.json({success: false, message: 'Not Authorized Login Again'})
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = token_decode.id; // Assign decoded user ID to req.userId
        console.log(req.userId);
        
        next()
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export default authUser;