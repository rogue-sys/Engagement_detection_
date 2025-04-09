'use client'
import { APP_NAME, homeButtonClasses } from "@/lib/constants";
import React from "react";
import {motion} from "framer-motion"
import { slideAnimation } from "@/lib/motion";
import Link from "next/link";


const Page = () => {
  return (
      <motion.div {...slideAnimation("right")} className="flex flex-col gap-2 justify-center min-h-[calc(100%-100px)] pb-[30px]">
        <h2 className="text-2xl opacity-65 sm:text-3xl md:text-4xl lg:text-6xl font-bold">
          Welcome to {APP_NAME}
        </h2>
        <p className="text-[16px] md:text-[20px]">Automatic Live Engagement Detection Of Students During Online Meeting
        </p>
        <Link href={'/meetings'} className={`${homeButtonClasses} w-fit`}>Get Started</Link>
      </motion.div>
  );
};

export default Page;
