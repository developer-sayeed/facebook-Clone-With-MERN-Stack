import mongoose from "mongoose";

const userModel = mongoose.Schema(
  {
    first_name: {
      type: String,
      requried: [true, "First Name are requried"],
      trim: true,
    },
    sur_name: {
      type: String,
      requried: [true, "Sur Name are requried"],
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      default: "",
    },
    secondary_name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    cell: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      requried: [true, "Password fields are requried"],
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    birth_date: {
      type: String,
      requried: [true, "Birth date fields are requried"],
    },
    birth_month: {
      type: String,
      requried: [true, "Birth Month fields are requried"],
    },
    birth_year: {
      type: String,
      requried: [true, "Birth Year fields are requried"],
    },
    profile_photo: {
      type: String,
      default: null,
    },
    cover_photo: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    work: {
      type: Array,
      default: [],
    },
    education: {
      type: Array,
      default: [],
    },
    living: {
      type: String,
      default: null,
    },
    home_town: {
      type: String,
      default: null,
    },

    relationship: {
      type: String,
      enum: ["Married", "UnMarried", "Single", "In a Relationship", "devoice"],
    },
    home_town: {
      type: Date,
    },
    soical: {
      type: Array,
      default: [],
    },
    friends: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    followes: {
      type: Array,
      default: [],
    },
    request: {
      type: Array,
      default: [],
    },
    bloked: {
      type: Array,
      default: [],
    },
    posts: {
      type: Array,
      default: [],
    },
    isActivate: {
      type: Boolean,
      default: false,
    },
    access_token: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    statue: {
      type: Boolean,
      default: true,
    },
    trash: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// export default students model
export default mongoose.model("User", userModel);
