"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { slideAnimation } from "@/lib/motion";
import { homeButtonClasses } from "@/lib/constants";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type InputType = {
  roomId: string;
  password: string;
};

type Props = {
  isCreate?: boolean;
};
const MeetingForm = ({ isCreate }: Props) => {
  const router = useRouter();
  const [inputs, setInputs] = useState<InputType>({
    roomId: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleNavigate = () => {
    setIsLoading(true);
    if (!inputs?.roomId || !inputs?.password) {
      toast.error("Please fill all fields.");
      setIsLoading(false);
      return;
    }

    //This is not a recommended method, You can use security in the backend socket connection ,thalkalam ith mathi :)
    //Problem : Everyone can access dashboard by just changing the url.
    if (isCreate) {
      router.push(
        `/meetings/${inputs.roomId}/dashboard?keys=${inputs.password}`
      );
    } else {
      router.push(`/meetings/${inputs.roomId}?keys=${inputs.password}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const inputClasses =
    "border border-gray-300 rounded p-2 w-full bg-white px-3";
  return (
    <motion.div
      {...slideAnimation("down")}
      className="flex flex-col gap-[10px] p-4 rounded bg-gray-100"
    >
      <p className="font-light text-lg md:text-xl">
        {isCreate ? "Create a Meeting" : "Join a Meeting"}
      </p>
      <input
        className={inputClasses}
        name="roomId"
        onChange={handleChange}
        value={inputs.roomId}
        type="text"
        placeholder="Meeting Name"
      />
      <input
        className={inputClasses}
        name="password"
        onChange={handleChange}
        value={inputs.password}
        type="text"
        placeholder="Meeting Password"
      />
      <button
        onClick={handleNavigate}
        disabled={isLoading}
        className={homeButtonClasses}
      >
        {isCreate
          ? isLoading
            ? "Creating..."
            : "Create"
          : isLoading
          ? "Joining..."
          : "Join"}
      </button>
    </motion.div>
  );
};

export default MeetingForm;
