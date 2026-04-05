import dotenv from "dotenv";
const NODE_ENV= process.env.NODE_ENV

let env_paths={
    development: ".env.development",
    production: ".env.production"
}

dotenv.config({path:`./config/${env_paths[NODE_ENV]}`})

export const Port = process.env.PORT
export const mongoo_db= process.env.MONGOO_DB
export const salt_rounds= Number(process.env.SALT_ROUNDS)
export const secret_key = process.env.SECRET_KEY
export const refresh_secret_key= process.env.REFRESH_SECRET_KEY
