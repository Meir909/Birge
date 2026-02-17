import * as bcrypt from 'bcryptjs';

export class PasswordUtil {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BcryptSaltRounds) || 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}