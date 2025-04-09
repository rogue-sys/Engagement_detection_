import MeetingForm from "@/components/meeting-form";
import React from "react";

const page = () => {
  return (
    <div>
      <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold">
        Meetings
      </p>
      <div className="grid sm:grid-cols-2 gap-[20px] my-[20px] px-[10px]">
        <MeetingForm isCreate />
        <MeetingForm  />
      </div>
    </div>
  );
};

export default page;
