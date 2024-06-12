const { error } = require("console");
const userModel = require("../../models/userModel");
const bcrypt = require("bcryptjs");

async function userSignUpController(req, res) {
  try {
    
    const { email, password, name } = req.body;

    const user = await userModel.findOne({email})

    console.log(user)

    if (user) {
      throw new Error("Already User Exists")
    }

    if (!email) {
      throw new Error("Please Provide Email");
    }
    if (!password) {
      throw new Error("Please Provide Password");
    }
    if (!name) {
      throw new Error("Please Provide Name");
    }
    
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = await bcrypt.hashSync(password, salt);

    if (!hashPassword) {
      throw new Error("Something Is Wrong")
    }

    const payload = {
      ...req.body,
      role: "GENERAL",
      password: hashPassword
    }

    const userData = new userModel(payload);
    const saveUser = await userData.save()

    res.status(201).json({
      data: saveUser,
      success: true,
      error: false,
      message: "User Created Successfully"
    })

  } catch (error) {
    res.json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

module.exports = userSignUpController
