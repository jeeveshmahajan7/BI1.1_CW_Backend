const mongoose = require("mongoose");

const twitterProfileSchema = new mongoose.Schema({
  profilePic: String,
  fullName: String,
  userName: String,
  bio: String,
  followersCount: Number,
  followingCount: Number,
  companyName: String,
  location: String,
  portfolioLink: String,
  handle: String,
  isOnline: Boolean,
});

const TwitterProfile = mongoose.model("TwitterProfile", twitterProfileSchema);

module.exports = TwitterProfile;
