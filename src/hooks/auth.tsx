import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { checkAccessSafe } from "~/lib/auth";

export const useAuth = (permission?: string) => {
  const { data: session, ...rest } = useSession();
  const canEdit = useMemo(
    () => (permission ? checkAccessSafe(session, permission) : false),
    [session, permission],
  );
  return { canEdit, session, ...rest };
};
