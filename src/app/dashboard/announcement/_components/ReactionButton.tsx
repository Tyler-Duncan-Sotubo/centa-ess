"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateMutation } from "@/hooks/useCreateMutation";
import { FaRegSmile } from "react-icons/fa";

const reactions = [
  { type: "like", label: "👍" },
  { type: "celebrate", label: "🎉" },
  { type: "love", label: "❤️" },
  { type: "happy", label: "😄" },
  { type: "clap", label: "👏" },
  { type: "sad", label: "😢" },
  { type: "angry", label: "😡" },
];

const reactionMap: Record<string, string> = {
  like: "👍",
  celebrate: "🎉",
  love: "❤️",
  happy: "😄",
  clap: "👏",
};

export default function ReactionButton({
  announcementId,
  reactionCounts,
  userHasReacted,
}: {
  announcementId: string;
  reactionCounts: { reactionType: string; count: string }[];
  userHasReacted: boolean;
}) {
  const totalReactions = reactionCounts.reduce(
    (sum, item) => sum + parseInt(item.count),
    0
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const createReaction = useCreateMutation({
    endpoint: `/api/announcement/${announcementId}/reaction`,
    successMessage: "Reaction updated successfully",
    refetchKey: "announcement-detail announcement",
    onSuccess: () => {
      setLoading(false);
      setOpen(false);
    },
    onError: () => {
      setLoading(false);
    },
  });

  const handleReaction = async (reactionType: string) => {
    setLoading(true);
    try {
      await createReaction({ reactionType });
    } catch (error) {
      console.error("Failed to react:", error);
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={`flex items-center space-x-1 ${
            userHasReacted ? "text-blue-600" : "text-gray-600"
          }`}
          disabled={loading}
        >
          {totalReactions === 0 ? (
            <FaRegSmile className="w-5 h-5 text-gray-400" />
          ) : (
            <span className="flex space-x-1">
              {reactionCounts.map((item) => (
                <span key={item.reactionType}>
                  {reactionMap[item.reactionType]}
                </span>
              ))}
            </span>
          )}
          <span>
            {totalReactions} Reaction{totalReactions !== 1 && "s"}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent className="flex space-x-2 p-3 ml-10">
        {reactions.map((reaction) => (
          <button
            key={reaction.type}
            className="text-2xl hover:scale-125 transition"
            onClick={() => handleReaction(reaction.type)}
          >
            {reaction.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
