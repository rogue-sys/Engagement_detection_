'use client';
import DashBoard from "@/components/dashboard";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const page = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const keys = searchParams.get("keys");

  if (!keys || !id || typeof id !== "string") {
    return <p>Invalid Meeting ID or Key</p>;
  }

    return (
      <div className="m-4">
        <DashBoard password={keys} roomId={id} />
      </div>
    );

};

export default page;
