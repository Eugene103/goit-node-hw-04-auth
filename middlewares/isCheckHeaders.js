import  jwt from "jsonwebtoken"
import "dotenv/config"
import HttpError from "../helpers/HttpError.js"
import User from "../models/User.js"

const {JWT_SECRET} = process.env

const isCheckHeaders = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return next(HttpError(401, "Not authorized"))
    }
    const [ bearer, token ] = authorization.split(" ")
    if (bearer !== "Bearer") {
        return next(HttpError(401, "Not 'Bearer' "))
    }
    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id)
        if (!user || !user.token || token !== user.token) {
            return next(HttpError(401, "Not authorized"))
        }
        req.user = user
        next()
    } catch (error) {
        next(HttpError(401, error))
    }
}
export default isCheckHeaders