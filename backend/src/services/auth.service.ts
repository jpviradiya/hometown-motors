import { AuthRepository } from "#/repositories";

type RegisterUserDto = {
  name: string;
  email: string;
  password: string;
};

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(data: RegisterUserDto) {
    const existingUser = await this.authRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("Email already exists");
    }

    await this.authRepository.create(data);

    return {
      message: "User registered successfully",
    };
  }
}
