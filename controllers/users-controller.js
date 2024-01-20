import HttpError from "../helpers/HttpError.js";
import User from "../models/User.js";
import { userRegSchema, userSubscripSchema } from "../models/User.js"
import bcrypt from "bcrypt"
import  jwt  from "jsonwebtoken";
import "dotenv/config"

const {JWT_SECRET} = process.env

const signup = async (req, res, next) => {
    try {
        const { error } = userRegSchema.validate(req.body)
        if (error) {
            throw HttpError(400, error.message)
        }
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (user) {
            throw HttpError(409, "Email in use")
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const result = await User.create({ ...req.body, password: hashPassword })

        res.status(201).json({
            email: result.email,
            subscription: result.subscription,
        })
    } catch (error) {
        next(error)
    }
};
const signin = async (req, res, next) => {
    try { const { error } = userRegSchema.validate(req.body)
        if (error) {
            throw HttpError(400, error.message)
        }
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            throw HttpError(401, "Email or password is wrong")
        }

        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            throw HttpError(401, "Email or password is wrong")
        }

        const { _id: id } = user;
        const payload = {
            id
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" })
        
        await User.findByIdAndUpdate(id, {token})

        res.status(201).json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription,
            }
        })
    } catch (error) {
        next(error)
    }
}
const sigout = async (req, res, next) => {
    try {
        const { _id } = req.user;
        await User.findByIdAndUpdate(_id, { token: "" });
        res.json({message: "Logout success"})
    } catch (error) {
        next(error)
    }
}
const getCurrent = async (req, res, next) => {
   try {
     const { email, subscription } = req.user
    res.status(200).json({
        email: email,
        subscription: subscription
    })
   } catch (error) {
    next(error)
   }
}
const updateSubs = async (req, res, next) => {
    try {
        const { error } = userSubscripSchema.validate(req.body)
        if (error) {
            throw HttpError(400, error.message)
        }
        const {_id} = req.user
        const result = await User.findOneAndUpdate({_id}, req.body)
         if (!result) {
            throw HttpError(404, 'Not found')
        }
        res.status(200).json({
            "id": result._id,
            "email": result.email,
            "subscription": result.subscription,
        });
    } catch (error) {
        next(error)
    }
}
export default {
    signup,
    signin,
    getCurrent,
    sigout,
    updateSubs
}