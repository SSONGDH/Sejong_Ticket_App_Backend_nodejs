import { sejongAuthDelegator } from "@coffee-tree/sejong-auth-delegator";

class AuthService {
  async login(userId, password) {
    if (!userId || !password) {
      throw new Error("User ID and Password are required");
    }

    const loginRequestDto = sejongAuthDelegator().createLoginRequestDto(
      userId,
      password
    );
    const userProfile = await sejongAuthDelegator().getUserProfile(
      loginRequestDto
    );

    return userProfile;
  }
}

export default new AuthService();
