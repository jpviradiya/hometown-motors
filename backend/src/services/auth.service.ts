import { AuthRepository } from "#/repositories";
import bcrypt from "bcrypt";

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
    const hashedPassword = await bcrypt.hash(data.password, 10);

    await this.authRepository.create({ ...data, password: hashedPassword });

    return {
      message: "User registered successfully",
    };
  }
}
