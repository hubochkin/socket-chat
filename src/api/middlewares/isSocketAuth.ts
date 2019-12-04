import jwt from 'jsonwebtoken';
import config from '../../config';

const getTokenFromHeader = socket => {

    if (
        (socket.headers.authorization && socket.headers.authorization.split(' ')[0] === 'Token') ||
        (socket.headers.authorization && socket.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
        return socket.headers.authorization.split(' ')[1];
    }
    return null;
};


const isSocketAuth = (secret, token) => {
    
    const parsedToken = getTokenFromHeader(token);
    // console.log(parsedToken)
    
    try {
        const tokenData = jwt.verify(parsedToken, secret);
        return tokenData;
    } catch (e) {
        return (e);
    }
}


export default isSocketAuth;
