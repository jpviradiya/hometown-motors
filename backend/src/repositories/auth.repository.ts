type User = {
  name: string;
  email: string;
  password: string;
};

export class AuthRepository {
  private readonly users: User[] = [];

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async create(user: User) {
    this.users.push(user);
    return user;
  }
}
