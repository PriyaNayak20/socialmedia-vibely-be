const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.sendOtp = async (req, res) => {
    try {
        const { email , mobile } = req.body;
        if(!email && !mobile) {
            return res.status(400).json({message : "Email or mobile is required"});
        }
        // check if verifed user already exists
        const existingUser = await User.findOne({
            where : {
                 ...(email ? {email }: {mobile}),
                 isVerified : true,
            },
        });

        if(existingUser) {
            return res.status(400).json({message : "User already registered"})
        }
        //genrate the otp 
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); 
        let user = await User.findOne({
      where: email ? { email } : { mobile },
    });

    if (user) {
      // update existing unverified user
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();    
    } else {
      // create new user
      user = await User.create({
        email,
        mobile,
        otp,
        otpExpires,
      });
    }

    console.log("OTP:", otp); // for testing

    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
   
}

exports.verifyOtp = async (req, res) => {
  try {
    const { email, mobile, otp } = req.body;

    if ((!email && !mobile) || !otp) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const user = await User.findOne({
      where: email ? { email } : { mobile },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.status(200).json({
      message: "OTP verified successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.completeRegistration = async (req, res) => {
  try {
    const { email, mobile, name, password, profilePic } = req.body;

    if ((!email && !mobile) || !name || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const user = await User.findOne({
      where: email ? { email } : { mobile },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "User not verified" });
    }

    if (user.password) {
      return res.status(400).json({ message: "User already completed registration" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.name = name;
    user.password = hashedPassword;
    user.profilePic = profilePic;

    await user.save();

    // generate JWT
    const token = jwt.sign(
      { id: user.id },
      "secretkey", // later move to .env
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Registration completed",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profilePic: user.profilePic,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => { 
  try {
    const { email, mobile, password } = req.body;

    if ((!email && !mobile) || !password) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const user = await User.findOne({
      where: email ? { email } : { mobile },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "User not verified" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Registration not completed" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profilePic: user.profilePic,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};










    
