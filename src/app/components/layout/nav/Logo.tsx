import Image from "next/image";
import { useRouter } from "next/navigation";

export const Logo = () => {
  const router = useRouter();

  return (
    <div
      className="flex flex-col items-center justify-center w-full md:flex-row md:items-center md:justify-start md:w-auto" // Center on small screens, align left on larger screens
      onClick={() => router.push("/pages/home")}
    >
      {/* Smaller logo with transparency */}
      <div className="relative w-12 h-12 opacity-60">
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
      <div className="relative w-32 mt-2 md:mt-0 h-16">
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
