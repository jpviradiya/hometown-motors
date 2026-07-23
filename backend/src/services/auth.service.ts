import { ConflictError, UnauthorizedError } from "#/errors";
import { generateJwtToken } from "#/lib/jwt";
import { AuthRepository } from "#/repositories";
import { LoginUserDto, RegisterUserDto } from "#/validators";
import bcrypt from "bcrypt";

const BCRYPT_SALT_ROUNDS = 10;

export class AuthService {
  constructor(private readonly authRepository: AuthRepository = new AuthRepository()) {}

  // Hash user password using bcrypt before persisting to ensure credentials safety.
  async register(data: RegisterUserDto): Promise<{ message: string }> {
    const existingUser = await this.authRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);

    await this.authRepository.create({
      name: data.name,
      email: data.email,
      passwordHash: hashedPassword,
    });

    return {
      message: "User registered successfully",
    };
  }

  // Validate credentials and issue signed JWT for session management.
  async login(data: LoginUserDto): Promise<{ message: string; token: string }> {
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

  // Fetch current user details from payload ID.
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
