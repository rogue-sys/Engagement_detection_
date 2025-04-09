import React from "react";

type Props = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
};
const Username = ({ name, setName }: Props) => {
  return (
    <div>
      <input placeholder="Enter Your Name" className="rounded w-full h-[40px] border px-3" value={name} onChange={(e) => setName(e.target.value)} />
    </div>
  );
};

export default Username;
