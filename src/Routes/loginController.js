const patientModel = require("../Models/Patient");
const pharmacistModel = require("../Models/Pharmacist");
const adminModel = require("../Models/Admin");
const OTP = require("../Models/OTP");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { generateAccessToken } = require("../middleware/authMiddleware");

const login = async (req, res) => {
  try {
    const patient = await patientModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const pharmacist = await pharmacistModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });
    const admin = await adminModel.findOne({
      Username: { $regex: "^" + req.body.Username + "$", $options: "i" },
    });

    if (!pharmacist && !patient && !admin) {
      return res.status(400).json({ error: "Username not found!" });
    } else if (patient) {
      if (await bcrypt.compare(req.body.Password, patient.Password)) {
        const user = {
          id: patient._id,
          role: "Patient",
        };
        accessToken = generateAccessToken(user);
        refreshToken = jwt.sign(
          { id: patient._id },
          process.env.REFRESH_TOKEN_SECRET
        );
        res.json({
          accessToken: accessToken,
          refreshToken: refreshToken,
          id: patient._id,
          type: "Patient",
        });
      } else {
        res.status(400).json({ error: "Password doesn't match!" });
      }
    } else if (pharmacist) {
      if (await bcrypt.compare(req.body.Password, pharmacist.Password)) {
        const user = {
          id: pharmacist._id,
          role: "Pharmacist",
        };
        accessToken = generateAccessToken(user);
        refreshToken = jwt.sign(
          { id: pharmacist._id },
          process.env.REFRESH_TOKEN_SECRET
        );
        res.json({
          accessToken: accessToken,
          refreshToken: refreshToken,
          id: pharmacist._id,
          type: "Pharmacist",
        });
      } else {
        res.status(400).json({ error: "Password doesn't match!" });
      }
    } else if (admin) {
      if (await bcrypt.compare(req.body.Password, admin.Password)) {
        const user = {
          id: admin._id,
          role: "Admin",
        };
        accessToken = generateAccessToken(user);
        refreshToken = jwt.sign(
          { id: admin._id },
          process.env.REFRESH_TOKEN_SECRET
        );
        res.json({
          accessToken: accessToken,
          refreshToken: refreshToken,
          id: admin._id,
          type: "Admin",
        });
      } else {
        res.status(400).json({ error: "Password doesn't match!" });
      }
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//-------------------------------Password Reset ---------------------------------------

const forgotPassword = async (req, res) => {
  try {
    const patient = await patientModel.findOne({
      Email: { $regex: "^" + req.body.email + "$", $options: "i" },
    });
    const pharmacist = await pharmacistModel.findOne({
      Email: { $regex: "^" + req.body.email + "$", $options: "i" },
    });
    const admin = await adminModel.findOne({
      Email: { $regex: "^" + req.body.email + "$", $options: "i" },
    });

    //const patient = await patientModel.find({Email: email});
    if (!pharmacist && !patient && !admin) {
      return res.status(404).json({
        error: "There's no account associated with the provided email."
      });
    }

    const passwordResetOTP = await sendPasswordResetOTP(req.body.email);

    res.status(200).json(passwordResetOTP);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const sendPasswordResetOTP = async (email) => {
  try {
    //delete any previously generated otp for this email
    await OTP.deleteOne({ email });

    //generate OTP
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`; //random otp
    const otpExpire = new Date();
    otpExpire.setMinutes(otpExpire.getMinutes() + 10);

    //set up source email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "spiderwebsacl@gmail.com",
        pass: "vngs gkzg otrz vzbg",
      },
    });

    //format email details
    const mailOptions = {
      from: "spiderwebsacl@gmail.com",
      to: email,
      subject: "Password reset OTP",
      html: `<p>Enter the code below to reset your password:</p>
              <p style="color:red; font-size:25px; letter-spacing:2px;"><b>${otp}</b></p>
              <p>This code <b>expires in 10 minutes</b>.</p>`,

      // text: `Enter the code below to reset your password: \n\n ${otp} \n It expires in 10 minutes.`,
    };

    //send email
    transporter.sendMail(mailOptions);

    //save OTP record in DB for verification
    const hashedOTP = await bcrypt.hash(otp, 10); //for security
    const newOTP = await OTP.create({
      email,
      otp: hashedOTP,
      expiry: otpExpire,
    });

    return newOTP;
  } catch (err) {
    throw err;
  }
};


const verifyOTP = async(req, res) => {
  try{

    const {email, otp} = req.body;

    if (!(email && otp)) {
      return res.status(404).json({ error: "Provide Values of email and OTP" });
    }

    //check if OTP exists
    const matchedOTP = await OTP.findOne({email});

    if(!matchedOTP){
      return res.status(404).json({ error: "No OTPs were generated for this email" });
    }

    //check expiry
    const expiresAt = matchedOTP.expiry;
    
    //otp expired
    if(expiresAt < Date.now()){   
      //delete OTP record
      await OTP.deleteOne({email});
      return res.status(400).json({ error: "OTP has expired! Request a new one."});
    }

    //not expired
    const hashedOTP = matchedOTP.otp;

    //check if otp is correct
    // return await bcrypt.compare(otp, hashedOTP);
    if( await bcrypt.compare(otp, hashedOTP)) 
      res.status(200).json({valid: true});
    else
      res.status(400).json( {error: "Invalid OTP"} );

  } catch(error){
      res.status(500).json({ error: error.message });
  }
}


const resetPassword = async (req, res) => {
  try {
    const { email, newPass } = req.body;

    if (!(email && newPass)) {
      return res.status(404).json({ error: "missing fields" });
    }

    //find user to update password
    const patient = await patientModel.findOne({
      Email: { $regex: "^" + req.body.email + "$", $options: "i" },
    });
    const pharmacist = await pharmacistModel.findOne({
      Email: { $regex: "^" + req.body.email + "$", $options: "i" },
    });
    const admin = await adminModel.findOne({
      Email: { $regex: "^" + req.body.email + "$", $options: "i" },
    });

    if (!pharmacist && !patient && !admin) {
      return res.status(404).json({
        error: "There's no account associated with the provided email."
      });
    }

    //hash new Password
    const hashedPass = await bcrypt.hash(newPass, 10);

    //update password
     var newUser;

    if(patient){
      newUser = await patientModel.findByIdAndUpdate(patient._id, {Password: hashedPass}, {new: true});
    }
    else if(pharmacist){
       newUser = await pharmacistModel.findByIdAndUpdate(pharmacist._id, {Password: hashedPass}, {new: true});

    }
    else if(admin){
       newUser = await adminModel.findByIdAndUpdate(admin._id, {Password: hashedPass}, {new: true});
    }

    //otp no longer needed
    await OTP.deleteOne({email});

    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

//------------------------EXPORTS------------------------------

module.exports = {
  login,
  forgotPassword,
  resetPassword,
  sendPasswordResetOTP,
  verifyOTP,
};
