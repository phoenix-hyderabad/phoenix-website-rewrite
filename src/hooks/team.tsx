import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addMember, deleteMember } from "~/server/actions/team";

export const useAddMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const addMutation = useMutation({
    mutationFn: addMember,
    onSuccess: () => {
      void queryClient.refetchQueries({ queryKey: ["team"] });
      toast.success("Added member successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Error adding member");
    },
  });
  return addMutation;
};

export const useDeleteMutation = () => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      void queryClient.refetchQueries({ queryKey: ["team"] });
      toast.success("Deleted member successfully");
    },
    onError: () => {
      toast.error("Error deleting member");
    },
  });
  return deleteMutation;
};
