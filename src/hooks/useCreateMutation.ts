import { axiosInstance } from "@/lib/axios";
import { extractErrorMessage } from "@/utils/errorHandler";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CreateMutationParams<T> = {
  endpoint: string;
  successMessage?: string;
  refetchKey?: string; // For refreshing queries
  onSuccess?: () => void;
  onError?: (errorMsg: string) => void;
};

/**
 * Reusable mutation hook for creating data via POST request.
 * Handles success, errors, and query refetching.
 */
export function useCreateMutation<T>({
  endpoint,
  successMessage = "Created successfully!",
  refetchKey,
  onSuccess,
  onError,
}: CreateMutationParams<T>) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  /**
   * Executes the mutation.
   * @param data - The data to be sent in the request.
   * @param setError - Function to set error state in the UI.
   * @param resetForm - Optional function to reset a form.
   * @param onClose - Optional function to close a modal.
   */
  const create = async (
    data?: T,
    setError?: (errorMsg: string) => void,
    resetForm?: () => void,
    onClose?: () => void
  ) => {
    try {
      const res = await axiosInstance.post(endpoint, data);

      if (res.data) {
        toast({
          title: successMessage,
          description: "The operation was successful",
          variant: "success",
        });

        resetForm?.(); // Reset form if provided
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

  return create;
}
