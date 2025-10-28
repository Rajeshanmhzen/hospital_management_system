import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import { createUser } from "../services/user.service.js"
import { generateToken } from "../utils/generateToken.js";

export const register = async(req,res,next)=> {
    try {
        const {fullname, email, password, role, specialization} = req.body;
        const existingUser = await User.findOne({email:email});
        if(existingUser) {
            res.status(400).json({
                error:true,
                message:"User already registered."
            });
        };
        const salt = await bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(password, salt);

        let user = await createUser({fullname, email, password:hashedPassword, role, specialization});
        user = {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            role:user.role,
            specialization:user?.specialization || null,
        }
        const token = generateToken(user)

        res.status(201).json({
            success:true,
            token:token,
            user,
            message:"User created Successfully",
        });


    } catch (err) {
        next(err);
    };
};

export const login = async(req,res, next)=> {
try {
    const {email, password} = req.body

    let user = await User.findOne({email})
    if(!user) {
        res.status(400).json({
            error:true,
            message:"User is not found",
        });
    }

    if(user.lockUntil && user.lockUntil > Date.now()) {
        const remainingTime = (user.lockUntil - Date.now())/1000;
        return res.status(400).json({
            message:`Account is locked. Please try agian in ${Math.ceil(remainingTime)}seconds`,
            error:true,
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(isMatch) {
      user.failedAttempts = 0;
      user.lockUntil = null;
       user = {
        id:user._id,
        fullname:user.fullname,
        email:user.email,
        role:user?.role,
    }
    const token = await generateToken(user);

    res.status(200).json({
        success:true,
        message:"Login Successfully",
       token:token,
        user
    });
    return;
    }else {
        user.failedAttempts += 1;
        const lockTimes = [1,5];
        const maxAttempts = lockTimes.length;

        let locktime = 0;
        for(let i = 0; i<maxAttempts; i++) {
            if(user.failedAttempts <(i + 1) * 3) {
                locktime = locktimes[i];
                break;
            };
        };

        if(user.failedAttempts > maxAttempts *3) {
            locktime = lockTimes[maxAttempts -1];
        };

        if(locktime > 0) {
            user.lockUntil = Date.now() + locktime * 1000;
        };

        await user.save();

        return res.status(400).json({
        message: `Incorrect password. Attempt ${user.failedAttempts}/3. Please try again after the lock period ${lockTime}s.`,
        success: false,
      });
    }
    
   
} catch (err) {
    next(err)
}
};
