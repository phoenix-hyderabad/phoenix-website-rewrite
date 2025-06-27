import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addProfessor, deleteProfessor } from "~/server/actions/professors";

export const useAddMutation = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const addMutation = useMutation({
    mutationFn: addProfessor,
    onSuccess: () => {
      void queryClient.refetchQueries({ queryKey: ["professors"] });
      toast.success("Added professor successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Error adding professor");
    },
  });
  return addMutation;
};

export const useDeleteMutation = () => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteProfessor,
    onSuccess: () => {
      void queryClient.refetchQueries({ queryKey: ["professors"] });
      toast.success("Deleted professor successfully");
    },
    onError: () => {
      toast.error("Error deleting professor");
    },
  });
  return deleteMutation;
};
