import { FaGift, FaMoneyCheck } from "react-icons/fa";
import {
  MdDashboard,
  MdFeedback,
  MdLeaderboard,
  MdOutlineFlag,
  MdOutlineRateReview,
} from "react-icons/md";
import { MdAccessAlarms } from "react-icons/md";
import { FaClipboardUser } from "react-icons/fa6";
import { LuHandCoins } from "react-icons/lu";
import { FaTags } from "react-icons/fa6";
import { PiSneakerMoveFill } from "react-icons/pi";

export const main = [
  {
    title: "Home",
    icon: <MdDashboard size={25} />,
    link: "/dashboard",
  },
  {
    title: "Profile",
    icon: <FaClipboardUser size={20} />,
    link: "/dashboard/profile",
  },
  {
    title: "Performance",
    icon: <MdLeaderboard size={20} />,
    link: "/dashboard/performance",
    subItems: [
      {
        title: "Goals",
        icon: <MdOutlineFlag size={20} />,
        link: "/dashboard/performance/goals",
      },
      {
        title: "Feedback",
        icon: <MdFeedback size={20} />,
        link: "/dashboard/performance/feedback",
      },
      {
        title: "Appraisals",
        icon: <MdOutlineRateReview size={20} />,
        link: "/dashboard/performance/reviews",
      },
    ],
  },
  {
    title: "Timesheet",
    icon: <MdAccessAlarms size={20} />,
    link: "/dashboard/attendance",
  },
  {
    title: "leave",
    icon: <PiSneakerMoveFill size={20} />,
    link: "/dashboard/leave",
  },
  {
    title: "Salary Advance",
    icon: <FaMoneyCheck size={20} />,
    link: "/dashboard/loans",
  },
  {
    title: "Reimbursements",
    icon: <LuHandCoins size={20} />, // You can change the icon to suit your preference
    link: "/dashboard/reimbursements",
  },
  {
    title: "Assets",
    icon: <FaTags size={20} />, // Icon for assets
    link: "/dashboard/assets",
  },
  {
    title: "Benefits",
    icon: <FaGift size={20} />, // You can change the icon to suit your preference
    link: "/dashboard/benefits",
  },
];
