"use client";
import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { GoHomeFill, GoHome } from "react-icons/go";
import { MdOutlineMeetingRoom, MdMeetingRoom } from "react-icons/md";
import { motion } from 'framer-motion'
import { slideAnimation } from "@/lib/motion";

const SideBar = () => {
  const pathName = usePathname();

  return (
    <motion.div {...slideAnimation("left")} className="sticky bg-[#1F2937] top-0 left-0 w-full h-[60px] text-[14px] md:text-[16px] md:min-w-[350px] md:min-h-screen bottom-0 text-white md:max-w-[350px] p-2 flex md:flex-col justify-between md:justify-start md:px-[30px] items-center md:items-start">
      <h2 className="text-lg md:text-2xl font-semibold md:text-center md:py-4">
        {APP_NAME}
      </h2>
      <nav className="flex md:w-full items-center md:flex-col gap-2 md:gap-4">

        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`flex md:w-full items-center gap-2 px-3 md:px-4 py-2 rounded- ${
              pathName === link.href
                ? "bg-[#374151] font-semibold"
                : "hover:bg-[rgb(55,65,81)] transition"
            }`}
          >
            {pathName === link.href ? link.activeIcon : link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
        
      </nav>
    </motion.div>
  );
};

export default SideBar;

const navLinks = [
  {
    label: "Home",
    href: "/",
    icon: <GoHome />,
    activeIcon: <GoHomeFill />,
  },
  {
    label: "Meetings",
    href: "/meetings",
    icon: <MdOutlineMeetingRoom />,
    activeIcon: <MdMeetingRoom />,
  },
];
