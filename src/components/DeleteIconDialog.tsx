"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDeleteMutation } from "@/hooks/useDeleteMutation";
import { FaTrash } from "react-icons/fa6";

type DeleteType =
  | "attachment"
  | "goal-comment"
  | "feedback"
  | "expectation"
  | "appraisal-cycle"
  | "participant";

type Props = {
  itemId: string;
  type: DeleteType;
};

const deleteConfigMap: Record<
  DeleteType,
  {
    endpoint: (id: string) => string;
    successMessage: string;
    refetchKey: string;
  }
> = {
  attachment: {
    endpoint: (id) => `/api/performance-goals/attachments/${id}`,
    successMessage: "Attachment deleted",
    refetchKey: "goal",
  },
  "goal-comment": {
    endpoint: (id) => `/api/performance-goals/comments/${id}`,
    successMessage: "Comment deleted",
    refetchKey: "goal",
  },
  feedback: {
    endpoint: (id) => `/api/feedback/${id}`,
    successMessage: "Feedback deleted",
    refetchKey: "feedbacks",
  },
  expectation: {
    endpoint: (id) => `/api/performance-seed/role-expectations/${id}`,
    successMessage: "Expectation deleted",
    refetchKey: "framework-settings",
  },
  "appraisal-cycle": {
    endpoint: (id) => `/api/appraisals/cycle/${id}`,
    successMessage: "Appraisal cycle deleted",
    refetchKey: "appraisal-cycles",
  },
  participant: {
    endpoint: (id) => `/api/appraisals/${id}`,
    successMessage: "Participant deleted",
    refetchKey: "appraisal-cycle-details",
  },
};

export const DeleteIconDialog = ({ itemId, type }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const config = deleteConfigMap[type];

  const deleteMutation = useDeleteMutation({
    endpoint: config.endpoint(itemId),
    successMessage: config.successMessage,
    refetchKey: config.refetchKey,
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    setDisabled(true);
    try {
      await deleteMutation();
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
      setDisabled(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="link"
          size="icon"
          disabled={disabled || isDeleting}
          className="text-monzo-error"
        >
          <FaTrash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-monzo-error hover:bg-monzo-error/90 text-white"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
