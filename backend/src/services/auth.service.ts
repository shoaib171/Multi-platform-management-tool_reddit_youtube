import User, { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';

class AuthService {
  async register(data: Partial<IUser>) {
    const user = new User(data);
    return await user.save();
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1d',
    });

    return { user, token };
  }
}

export default new AuthService();
