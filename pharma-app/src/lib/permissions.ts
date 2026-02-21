import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const ac = createAccessControl({
  ...defaultStatements,
});

export const roles = {
  user: ac.newRole({
    ...adminAc.statements,
  }),
  admin: ac.newRole({
    ...adminAc.statements,
    user: ["ban", "impersonate", "list", "set-role"],
  }),
  superadmin: ac.newRole({
    ...adminAc.statements,
    user: ["ban", "impersonate", "list", "set-role", "delete"],
  }),
};
