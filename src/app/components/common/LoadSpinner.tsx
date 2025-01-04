import React from "react";
import Image from "next/image";

const LoadSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="relative w-16 h-16"> 
        {/* Rotating Logo */}
        <div className="absolute top-0 left-0 w-full h-full animate-spin-slow">
          <Image
            src="/imgs/logo2.png" 
            alt="Logo"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default LoadSpinner;
