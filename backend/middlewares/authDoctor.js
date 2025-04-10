
import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;

    // const token = req.headers.authorization;
    // console.log('Token:', dtoken);


    if (!dtoken) {
      return res.json({ success: false, message: 'Not Authorized' });
    }

    const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
    // console.log('Decoded Token:', token_decode);

    req.docId = token_decode.id;
    next();
  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;