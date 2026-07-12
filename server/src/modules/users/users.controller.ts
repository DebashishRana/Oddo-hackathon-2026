import { Request, Response } from "express";
import { ok } from "../../utils/apiResponse";
import { AppError } from "../../utils/errors";
import { usersService } from "./users.service";
import { hashPassword } from "../../utils/password";
import { userRepository } from "../../db/repositories/user.repository";
import { roleRepository } from "../../db/repositories/role.repository";
import { activityService } from "../../services/activity.service";

const parseOptionalString = (value: unknown) => (typeof value === "string" ? value.trim() || undefined : undefined);

const ALLOWED_PROMOTE_ROLES = ["employee", "department_head", "asset_manager"];

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

    if (name !== undefined) updatePayload.name = name;
    if (department !== undefined) updatePayload.department = department;
    if (password) updatePayload.passwordHash = await hashPassword(password);

    const updated = await userRepository.update(authUser.id, updatePayload);
    return ok(res, "Profile updated successfully.", {
      user: updated
        ? {
            id: updated.id,
            email: updated.email,
            name: updated.name,
            department: updated.department,
            departmentId: updated.department_id,
            role: updated.role_slug,
            isActive: updated.is_active,
            createdAt: updated.created_at,
            updatedAt: updated.updated_at,
          }
        : null,
    });
  }

  async listUsers(_req: Request, res: Response) {
    const users = await userRepository.list();
    return ok(res, "Users retrieved successfully.", {
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        department: u.department,
        departmentId: u.department_id,
        role: u.role_slug,
        isActive: u.is_active,
        createdAt: u.created_at,
        updatedAt: u.updated_at,
      })),
    });
  }

  async options(_req: Request, res: Response) {
    const users = await userRepository.listDirectory({ isActive: true });
    return ok(res, "User options retrieved.", {
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        department: u.department,
        departmentId: u.department_id,
        role: u.role_slug,
      })),
    });
  }

  async directory(req: Request, res: Response) {
    const { roleSlug, departmentId, isActive, q } = req.query;
    const filters: Record<string, unknown> = {};

    if (typeof roleSlug === "string") filters.roleSlug = roleSlug;
    if (departmentId) filters.departmentId = Number(departmentId);
    if (isActive !== undefined) filters.isActive = isActive === "true";
    if (typeof q === "string" && q.trim()) filters.q = q.trim();

    const users = await userRepository.listDirectory(filters);
    return ok(res, "Directory retrieved.", {
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        department: u.department,
        departmentId: u.department_id,
        departmentName: (u as Record<string, unknown>).dept_name ?? null,
        role: u.role_slug,
        roleName: u.role_name,
        isActive: u.is_active,
        createdAt: u.created_at,
      })),
    });
  }

  async updateRole(req: Request, res: Response) {
    const actorId = req.user!.id;
    const targetId = Number(req.params.id);
    if (!targetId) throw new AppError("Invalid user id", 400, "VALIDATION_ERROR", "Invalid user id.");

    const { role } = req.body;
    if (!role || !ALLOWED_PROMOTE_ROLES.includes(role)) {
      throw new AppError(
        `Invalid role. Must be one of: ${ALLOWED_PROMOTE_ROLES.join(", ")}`,
        400,
        "VALIDATION_ERROR",
        `Role must be one of: ${ALLOWED_PROMOTE_ROLES.join(", ")}`
      );
    }

    if (actorId === targetId) {
      throw new AppError("Cannot change your own role", 400, "VALIDATION_ERROR", "You cannot change your own role.");
    }

    const roleRecord = await roleRepository.findBySlug(role);
    if (!roleRecord) throw new AppError("Role not found", 404, "NOT_FOUND", "Role not found.");

    const target = await userRepository.findById(targetId);
    if (!target) throw new AppError("User not found", 404, "NOT_FOUND", "User not found.");

    const updated = await userRepository.update(targetId, { roleId: roleRecord.id });
    await activityService.log({
      actorId,
      action: "user.role_changed",
      entityType: "user",
      entityId: targetId,
      metadata: { from: target.role_slug, to: role },
    });

    await activityService.notify({
      userId: targetId,
      type: "role_updated",
      title: "Role updated",
      body: `Your role was changed to ${roleRecord.name}.`,
      entityType: "user",
      entityId: targetId,
    });

    return ok(res, "User role updated.", {
      user: updated
        ? { id: updated.id, email: updated.email, name: updated.name, role: updated.role_slug }
        : null,
    });
  }

  async updateStatus(req: Request, res: Response) {
    const actorId = req.user!.id;
    const targetId = Number(req.params.id);
    if (!targetId) throw new AppError("Invalid user id", 400, "VALIDATION_ERROR", "Invalid user id.");

    const { isActive } = req.body;
    if (typeof isActive !== "boolean") {
      throw new AppError("isActive must be a boolean", 400, "VALIDATION_ERROR", "isActive must be a boolean.");
    }

    if (actorId === targetId) {
      throw new AppError("Cannot change your own status", 400, "VALIDATION_ERROR", "You cannot change your own status.");
    }

    const updated = await userRepository.update(targetId, { isActive });
    await activityService.log({
      actorId,
      action: isActive ? "user.activated" : "user.deactivated",
      entityType: "user",
      entityId: targetId,
      metadata: {},
    });

    return ok(res, `User ${isActive ? "activated" : "deactivated"}.`, {
      user: updated ? { id: updated.id, email: updated.email, isActive: updated.is_active } : null,
    });
  }

  async updateUser(req: Request, res: Response) {
    const actorId = req.user!.id;
    const targetId = Number(req.params.id);
    if (!targetId) throw new AppError("Invalid user id", 400, "VALIDATION_ERROR", "Invalid user id.");

    const { name, departmentId, department } = req.body;
    const payload: Record<string, unknown> = {};

    if (name !== undefined) payload.name = typeof name === "string" ? name.trim() : name;
    if (departmentId !== undefined) payload.departmentId = departmentId != null ? Number(departmentId) : null;
    if (department !== undefined) payload.department = typeof department === "string" ? department.trim() || null : null;

    const updated = await userRepository.update(targetId, payload);
    await activityService.log({
      actorId,
      action: "user.updated",
      entityType: "user",
      entityId: targetId,
      metadata: { changes: payload },
    });

    return ok(res, "User updated.", {
      user: updated
        ? {
            id: updated.id,
            email: updated.email,
            name: updated.name,
            department: updated.department,
            departmentId: updated.department_id,
            role: updated.role_slug,
            isActive: updated.is_active,
          }
        : null,
    });
  }
}

export const usersController = new UsersController();
