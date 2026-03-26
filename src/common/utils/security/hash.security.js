import bcrypt from "bcrypt";

export const Hash=({plainText, salt = 12 } = {})=>{
    return bcrypt.hashSync(plainText, salt);
}

export const compareHash=({plainText, hashText})=>{
    return bcrypt.compareSync(plainText, hashText);
}