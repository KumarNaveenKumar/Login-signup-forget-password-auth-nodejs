const bcrypt = require('bcryptjs');
const UserService = require('../Services/user');
const jwt = require('jsonwebtoken');

const getAll = async (req, res) => {
    const users = await UserService.get({is_deleted: false},);
    console.log(users);
    res.status(200).json(users);
}

const signup = async (req, res) => {
    const user_body = req.body;
    const hashedPassword = await bcrypt.hash(user_body.password, 10);
    console.log(user_body.password, hashedPassword);
    user_body.password = hashedPassword;
    const [user, err] = await UserService.addOne(user_body)
        .then((user) => {
            console.log("User added");
            return [user, null]
        })
        .catch(err => {
            console.error(err.message);
            return [null, err];
        })
    const [a, b] = [1, 2]
    // await user.save();
    if(err){
        let msg = 'User Signup failed for unknown Reason!';
        if(err.code == '11000') msg = 'Email already Exists';
        return res.status(400).json({msg});
    }
    return res.status(200).json({msg: 'created user'});
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await UserService.getOne({ email }, { _id: 0 })
    if(!user) return res.status(404).json({msg: 'User Not found'});
    if(user && user.is_deleted) return res.status(400).json({msg: 'User is deleted!!'});
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({msg: 'Password Incorrect'});
    const { name } = user
    const token = jwt.sign(
        {
            name,
            email,
        },
        process.env.JWT_SECRET || 'default-secret-123',
        { expiresIn: process.env.expiresIn || "1d" }
    );

    const response = {
        status: "success",
        token,
        data: {
            name,
            email,
        },
    }

    return res.status(200).json(response);
}

const genOtp = async (req, res) => {
    const {email} = req.body;
    const user = await UserService.getOne({ email }, { _id: 0 })
    if(!user) return res.status(404).json({msg: 'User Not found'});
    if(user && user.is_deleted) return res.status(400).json({msg: 'User is deleted!!'});
    const code = Math.floor(10000 + Math.random() * 90000).toString(); // gen 6 digit number

    const expire = new Date(new Date().getTime() + 5 * 60 * 1000);
    await UserService.updateOne({email}, { otp: { code, expire, is_verified: false }});
    console.log("Otp: ",code, 'Expire on :', expire.toLocaleString());
    return res.status(200).json({ msg: 'otp genrated' })
}

const verifyOtp = async (req, res) => {
    const {email, code} = req.body;
    const user = await UserService.getOne({ email }, { _id: 0 })
    if(!user) return res.status(404).json({msg: 'User Not found'});
    if(user && user.is_deleted) return res.status(400).json({msg: 'User is deleted!!'});
    const otp = user.otp;

    if (otp.expire < new Date()) return res.status(400).json({ msg: 'otp  expired' });
    if(otp.code !== code) return res.status(400).json({ msg: 'otp  is wrong' });

    await UserService.updateOne({email}, {$set: {otp: {expire:  new Date(), is_verified: true}}})
    return res.status(200).json({ msg: 'otp verified' })
} 

const resetPassword = async (req, res) => {
    const { email,password } = req.body;
    const user = await UserService.getOne({ email }, { _id: 0 })
    if(!user) return res.status(404).json({msg: 'User Not found'});
    if(user && user.is_deleted) return res.status(400).json({msg: 'User is deleted!!'});
    if(!user.otp || !user.otp.is_verified) return res.status(400).json({ msg: 'OTP is not verified!' })
    const hashedPassword = await bcrypt.hash(password, 10);
    await UserService.updateOne({email}, {password: hashedPassword, 'otp.is_verified': false});
    return res.status(200).json({ msg: 'password updated' })
} 

module.exports = {
    getAll,
    create: signup,
    login,
    genOtp,
    verifyOtp,
    resetPassword
}