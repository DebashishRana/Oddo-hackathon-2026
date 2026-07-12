import { Request, Response } from "express";
import { ok } from "../../utils/apiResponse";
import { authService } from "../auth/auth.service";
import { usersService } from "./users.service";
import { hashPassword } from "../../utils/password";
import { userRepository } from "../../db/repositories/user.repository";

const parseOptionalString = (value: unknown) => (typeof value === "string" ? value.trim() || undefined : undefined);

export class UsersController {
  async me(req: Request, res: Response) {
    const authUser = req.user;
    if (!authUser) {
      return ok(res, "No active session.", { user: null });
    }

    const profile = await usersService.me(authUser.id);
    return ok(res, "Profile retrieved successfully.", { user: profile });
  }

  async updateMe(req: Request, res: Response) {
    const authUser = req.user;
    if (!authUser) {
      return ok(res, "No active session.", { user: null });
    }

    const name = parseOptionalString(req.body.name);
    const department = parseOptionalString(req.body.department);
    const password = parseOptionalString(req.body.password);
    const updatePayload: { name?: string; department?: string; passwordHash?: string } = {};

    if (name !== undefined) {
      updatePayload.name = name;
    }

    if (department !== undefined) {
      updatePayload.department = department;
    }

    if (password) {
      updatePayload.passwordHash = await hashPassword(password);
    }

    const updated = await userRepository.update(authUser.id, updatePayload);
    return ok(res, "Profile updated successfully.", {
      user: updated
        ? {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          department: updated.department,
          role: updated.role_slug,
          isActive: updated.is_active,
          createdAt: updated.created_at,
          updatedAt: updated.updated_at,
        }
        : null,
    });
  }

  async listUsers(_req: Request, res: Response) {
    const users = await authService.listUsers();
    return ok(res, "Users retrieved successfully.", { users });
  }
}

export const usersController = new UsersController();
