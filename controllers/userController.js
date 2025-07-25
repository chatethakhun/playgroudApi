import cloudinary from "../libs/cloudinary";
import { generateToken } from "../libs/utils";
import User from "../models/User";

export const signUp = async (req, res) => {
  const { email, password, fullName, bio } = req.body;
  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "Please fill in all the fields" });
    }

    const user = await User.findOne({ email });

    if (!!user) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      bio,
    });
    await newUser.save();

    const token = generateToken(newUser._id);

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser, token });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Password is incorrect" });
    }

    const token = generateToken(user._id);

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const checkAuth = async (req, res) => {
  res.json({ message: "Auth successful", user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, avatar } = req.body;
    const userId = req.user._id;
    let updatedUser;

    if (!avatar) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullName, bio },
        { new: true },
      );
    } else {
      const uploadAvatar = await cloudinary.uploader.upload(avatar);

      updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullName, bio, avatar: uploadAvatar.secure_url },
        { new: true },
      );
    }

    if (!updatedUser) {
      return res.status(400).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.log(`error from updateProfile: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
};
