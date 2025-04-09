"use client";
import { initializeSocket } from "@/lib/socket";
import React, { Fragment, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { CameraType, ResultType } from "./type";

const DashBoard = ({ password, roomId }: CameraType) => {
  const [result, setResult] = React.useState<ResultType[]>([]);

  const socketRef = useRef<ReturnType<typeof initializeSocket> | null>(null);

  useEffect(() => {
    socketRef.current = initializeSocket(
      () => toast.success("WebSocket connected successfully."),
      (data) => {
        if (data.roomId !== roomId || data.password !== password) {
          return;
        }
        setResult((prev: ResultType[]) => {
          const index = prev.findIndex((p: ResultType) => p.id === data.id);
          if (index === -1) {
            return [...prev, data];
          } else {
            const updatedResults = [...prev];
            updatedResults[index] = data;
            return updatedResults;
          }
        });
      },

      () => toast.error("WebSocket connection error."),
      () => toast("WebSocket disconnected.")
    );

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="px-[30px] mx-auto  w-full">
      <div className="grid grid-cols-2 ">
        <div className={`border p-2.5 font-bold`}>Name</div>
        <div className="border p-2.5 border-l-0  font-bold">Status</div>
        {result?.length > 0 &&
          result?.map((res, index) => (
            <Fragment key={index}>
              <div className={`border p-2.5 border-t-0`}>{res?.name}</div>
              <div className="border p-2.5 border-l-0 border-t-0">
                {res?.class}
              </div>
            </Fragment>
          ))}
      </div>
      {result?.length === 0 && (
        <div className="border border-t-0 p-3 text-center">No data yet.</div>
      )}
    </div>
  );
};

export default DashBoard;
