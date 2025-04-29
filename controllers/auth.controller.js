// Signup/Login Controller

import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { User } from '../models/userDB.models.js'
dotenv.config()

export const Login = async (req, res) => {
    try {
        console.log('Login API called..')

        const { name, email, phoneNumber } = req.body;

        let user = await User.findOne({ where: { email } });

        if (!user) {
            user = await User.create({ name, email, phoneNumber }); // Save new user to the database
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET_KEY); // Use specific fields for token

        res.cookie('access_token', token, {
            httpOnly: true,
            sameSite: 'Strict',
        })

        res.status(200).json({
            message: 'User login successfully..',
            success: true,
            user,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        })
    }

}

export const getUser = async (req, res) => {
    try {
        const token = req.cookies.access_token
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({ where: { id: decoded.id } })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            })
        }
        res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        })

    }
}