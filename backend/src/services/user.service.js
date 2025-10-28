import User from "../models/user.model.js"

export const findUserByEmail = async(email)=> {
    return await User.findOne(email);
};

export const createUser = async(data)=> {
    const user = new User(data);
    await user.save();
    return user;
};

export const getAllUsers = async()=> {
    return (await User.find()).select("-password");
};

export const getUserById = async(id)=> {
    return await User.findById(id).select("-password");
};