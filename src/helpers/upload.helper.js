const mongoose = require('mongoose');
const router = require('express').Router();
const multer = require('multer');
const User = require('../models/user.model');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//Configuration for Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const uploadImg = async (req, res) => {
  try {
    const { id } = req.user;
    const image = req.file.path;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(403).json('Invalid id!');
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          image: image
        }
      },
      { new: true }
    );
    res.status(200).json({ message: 'User Added Successfully!', updatedUser });
  } catch (err) {
    res.status(500).json(err);
  }
};

router.post('/', upload.single('image'), uploadImg);
