import bcrypt from "bcrypt";

const generateHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const checkHash = (password, hash) => {
    return bcrypt.compare(password, hash)
};

export default {generateHash, checkHash};


