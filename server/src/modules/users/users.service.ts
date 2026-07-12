import { AppError } from "../../utils/errors";
import { userRepository } from "../../db/repositories/user.repository";
import { hashPassword } from "../../utils/password";

const toProfile = (user: Awaited<ReturnType<typeof userRepository.findById>>) => {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    department: user.department,
    role: user.role_slug,
    isActive: user.is_active,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

export class UsersService {
  async me(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND", "User not found");
    }

    return toProfile(user);
  }

  async updateMe(userId: number, input: { name?: string; password?: string }) {
    const updatePayload: { name?: string; passwordHash?: string } = {};
    if (input.name !== undefined) {
      updatePayload.name = input.name;
    }

    if (input.password) {
      updatePayload.passwordHash = await hashPassword(input.password);
    }

    const updated = await userRepository.update(userId, updatePayload);
    if (!updated) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND", "User not found");
    }

    return toProfile(updated);
  }

  async listUsers() {
    const users = await userRepository.list();
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      department: user.department,
      role: user.role_slug,
      isActive: user.is_active,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }));
  }
}

export const usersService = new UsersService();
