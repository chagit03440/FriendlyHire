// components/nav/Logo.tsx
import Image from "next/image";
import { useRouter } from "next/navigation";

export const Logo = () => {
  const router = useRouter();

  return (
    <div
      className="flex items-center space-x-4" // space between logo and text
      onClick={() => router.push("/pages/home")}
    >
      {/* Smaller logo with transparency */}
      <div className="relative w-12 h-12 ml-8 opacity-60">
        {" "}
        {/* Smaller size and opacity set to 80% */}
        <Image
          src="/imgs/logo2.png"
          alt="FriendlyHire Logo"
          fill
          style={{ objectFit: "contain" }}
          className="!p-0"
          priority
        />
      </div>
      {/* Increased size for bigger text */}
      <div className="relative w-32 mt-2 h-16">
        <Image
          src="/friendlyhire-text.png"
          alt="FriendlyHire Text"
          fill
          style={{ objectFit: "contain" }}
          className="!p-0"
          priority
        />
      </div>
    </div>
  );
};
