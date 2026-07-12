import { userRepository } from "../../db/repositories/user.repository";
import { AppError } from "../../utils/errors";

export const usersService = {
  async me(userId: number) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("User not found", 404, "USER_NOT_FOUND", "User not found.");
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      department: user.department,
      departmentId: user.department_id,
      role: user.role_slug,
      isActive: user.is_active,
      emailVerifiedAt: user.email_verified_at,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  },
};
