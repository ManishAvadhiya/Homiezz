import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Password is required only if googleId is not set
    },
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  profileCompleted:{
    type:Boolean,
    default:false,
  }
}
,{
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    try{

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }catch(err){
        next(err);
    }
})
userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password,this.password);
}
const User = mongoose.model("User", userSchema);
export default User;
