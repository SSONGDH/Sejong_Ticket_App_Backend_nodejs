// userModel.js
import mongoose from "mongoose";

// userDB에 연결할 연결 객체 생성
const UserDB = mongoose.createConnection(process.env.MONGO_USER_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  studentId: String,
  major: String,
  gradeLevel: String,
  tickets: [String],
});

// 'UserDB' 연결을 사용하여 모델을 정의
const User = UserDB.model("User", userSchema);

export default User;
