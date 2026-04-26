import { useState, useCallback } from "react";
import { permissionGroups, type UserRole, type PermissionGroup } from "@/mocks/dashboardData";

const STORAGE_KEY = "crm_permissions_v1";

export interface PermissionState {
  groups: PermissionGroup[];
}

function loadPermissions(): PermissionGroup[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return permissionGroups;
    return JSON.parse(raw) as PermissionGroup[];
  } catch {
    return permissionGroups;
  }
}

function savePermissions(groups: PermissionGroup[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
}

export function usePermissions() {
  const [groups, setGroups] = useState<PermissionGroup[]>(loadPermissions);

  const checkPermission = useCallback(
    (role: UserRole, permissionKey: string): boolean => {
      if (role === "manager") return true;
      for (const group of groups) {
        const perm = group.permissions.find((p) => p.key === permissionKey);
        if (perm) return perm.roles[role] ?? false;
      }
      return false;
    },
    [groups]
  );

  const togglePermission = useCallback(
    (groupIdx: number, permIdx: number, role: UserRole) => {
      if (role === "manager") return;
      setGroups((prev) => {
        const updated = prev.map((g, gi) => {
          if (gi !== groupIdx) return g;
          return {
            ...g,
            permissions: g.permissions.map((p, pi) => {
              if (pi !== permIdx) return p;
              return { ...p, roles: { ...p.roles, [role]: !p.roles[role] } };
            }),
          };
        });
        savePermissions(updated);
        return updated;
      });
    },
    []
  );

  const setRolePermission = useCallback(
    (permissionKey: string, role: UserRole, value: boolean) => {
      if (role === "manager") return;
      setGroups((prev) => {
        const updated = prev.map((g) => ({
          ...g,
          permissions: g.permissions.map((p) => {
            if (p.key !== permissionKey) return p;
            return { ...p, roles: { ...p.roles, [role]: value } };
          }),
        }));
        savePermissions(updated);
        return updated;
      });
    },
    []
  );

  const resetToDefaults = useCallback(() => {
    setGroups(permissionGroups);
    savePermissions(permissionGroups);
  }, []);

  const getRolePermissions = useCallback(
    (role: UserRole): string[] => {
      const keys: string[] = [];
      for (const group of groups) {
        for (const perm of group.permissions) {
          if (role === "manager" || perm.roles[role]) {
            keys.push(perm.key);
          }
        }
      }
      return keys;
    },
    [groups]
  );

  const getRolePermCount = useCallback(
    (role: UserRole): number => {
      if (role === "manager") {
        return groups.reduce((acc, g) => acc + g.permissions.length, 0);
      }
      return groups.reduce(
        (acc, g) => acc + g.permissions.filter((p) => p.roles[role]).length,
        0
      );
    },
    [groups]
  );

  const totalPerms = groups.reduce((acc, g) => acc + g.permissions.length, 0);

  return {
    groups,
    totalPerms,
    checkPermission,
    togglePermission,
    setRolePermission,
    resetToDefaults,
    getRolePermissions,
    getRolePermCount,
  };
}
