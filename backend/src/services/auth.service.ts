import { ConflictError, UnauthorizedError } from "#/errors";
import { AuthRepository } from "#/repositories";
import { LoginUserDto, RegisterUserDto } from "#/validators";
import bcrypt from "bcrypt";
import { generateJwtToken } from "#/lib/jwt";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  // user registration services
  async register(data: RegisterUserDto) {
    const existingUser = await this.authRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError("Email already exists");
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    await this.authRepository.create({
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
    });

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

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = generateJwtToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: "Login successful",
      token,
    };
  }

  // get the current user data with token
  async getCurrentUser(userId: string) {
    const user = await this.authRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedError("Unauthorized");
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
