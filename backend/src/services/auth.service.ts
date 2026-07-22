import { ConflictError, UnauthorizedError } from "#/errors";
import { AuthRepository } from "#/repositories";
import { LoginUserDto, RegisterUserDto } from "#/validators";
import bcrypt from "bcrypt";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  // user registration services
  async register(data: RegisterUserDto) {
    const existingUser = await this.authRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    await this.authRepository.create({ ...data, password: hashedPassword });

    return {
      message: "User registered successfully",
    };
  }

  // user login services
  async login(data: LoginUserDto) {
    const user = await this.authRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    return {
      message: "Login successful",
    };
  }
}
