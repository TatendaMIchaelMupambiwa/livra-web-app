import React from "react";

function Spinner({ parentHeight = "100vh" }: { parentHeight?: string }) {
  return (
    <div
      style={{
        height: parentHeight !== "100vh" ? parentHeight : "100vh",
        width: "100%",
      }}
      className="flex items-center justify-center"
    >
      <div className="border-8 h-10 w-10 border-primary border-t-gray-300 rounded-full animate-spin  "></div>
    </div>
  );
}

export default Spinner;
