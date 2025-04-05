import { axiosInstance } from "@/lib/axios";
import { extractErrorMessage } from "@/utils/errorHandler";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type UpdateMutationParams<T> = {
  endpoint: string;
  successMessage?: string;
  refetchKey?: string; // For refreshing queries
  onSuccess?: () => void;
  onError?: (errorMsg: string) => void;
  method?: "PATCH" | "PUT"; // Default is PATCH
};

/**
 * Reusable mutation hook for updating data via PATCH/PUT request.
 */
export function useUpdateMutation<T>({
  endpoint,
  successMessage = "Updated successfully!",
  refetchKey,
  onSuccess,
  onError,
  method = "PUT",
}: UpdateMutationParams<T>) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  /**
   * Executes the mutation.
   * @param data - The data to be sent in the request.
   * @param setError - Function to set error state in the UI.
   * @param onClose - Optional function to close a modal.
   */
  const update = async (
    data: T,
    setError?: (errorMsg: string) => void,
    onClose?: () => void
  ) => {
    try {
      const res = await axiosInstance({
        method,
        url: endpoint,
        data,
      });

      if (res.data) {
        toast({
          title: successMessage,
          description: "successful",
          variant: "success",
        });

        onClose?.(); // Close modal if provided

        if (refetchKey) {
          queryClient.invalidateQueries({ queryKey: [refetchKey] });
        }

        onSuccess?.();
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);

      // Display error in UI
      setError?.(errorMessage);

      // Show error toast
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });

      onError?.(errorMessage);
    }
  };

  return update;
}
