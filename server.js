require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");
const user = require("./models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const auth = require("./middleware/auth");
const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log(err));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const failureSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  title: String,
  tags: [String],
  reason: String,
  mood: String,
  date: String
});
const Failure = mongoose.model("Failure", failureSchema);
const reflectionFile = path.join(__dirname, "data/reflections.json");
function readJSON(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return [];
  }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
app.use(express.json());
app.use(express.static("public"));
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.get("/api/failures",auth, async (req, res) => {
  const failures = await Failure.find({ user: req.userId });
  res.json(failures);
});
app.post("/api/failures",auth, async (req, res) => {
    await Failure.create({
    ...req.body,
    user: req.userId,   // ADD THIS
    date: new Date().toISOString()
  });
app.delete("/api/failures/:id", auth, async (req, res) => {
  await Failure.deleteOne({ _id: req.params.id, user: req.userId });
  res.json({ success: true });
});
app.put("/api/failures/:id", auth, async (req, res) => {
  await Failure.updateOne(
    { _id: req.params.id, user: req.userId },
    req.body
  );
  res.json({ success: true });
});
  res.json({ success: true });
});
app.get("/api/reflections", (req, res) => {
  res.json(readJSON(reflectionFile));
});
app.post("/api/reflections", (req, res) => {
  const data = readJSON(reflectionFile);
  data.push({ ...req.body, date: new Date().toISOString() });
  writeJSON(reflectionFile, data);
  res.json({ success: true });
});
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed });
  res.json({ success: true });
});
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Wrong password" });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});
app.get("/auth/google",
  passport.authenticate("google", { scope:["profile","email"] })
);
app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect:"/login.html" }),
  (req,res)=>{
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ id:req.user._id }, process.env.JWT_SECRET);
    res.redirect(`/?token=${token}`);
  }
);
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.BASE_URL + "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ email: profile.emails[0].value });
  if(!user){
    user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      password: "google-auth"
    });
  }
  done(null, user);
}));
passport.serializeUser((user, done)=> done(null, user.id));
passport.deserializeUser(async(id, done)=>{
  const user = await User.findById(id);
  done(null, user);
});
