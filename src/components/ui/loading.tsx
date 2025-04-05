"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex justify-center mt-20 mx-auto">
      <div className="flex space-x-2">
        <div className="w-3 h-3 rounded-full bg-gray-400 animate-ball-1"></div>
        <div className="w-3 h-3 rounded-full bg-gray-200 animate-ball-2"></div>
        <div className="w-3 h-3 rounded-full bg-gray-400 animate-ball-3"></div>
        <div className="w-3 h-3 rounded-full bg-gray-200 animate-ball-4"></div>
        <div className="w-3 h-3 rounded-full bg-gray-400 animate-ball-4"></div>
        <div className="w-3 h-3 rounded-full bg-gray-200 animate-ball-4"></div>
      </div>
    </div>
  );
}
