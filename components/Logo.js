// components/Logo.js
import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/icons/logo.png"
      alt="Angstrom"
      width={22}
      height={22}
      className="transition-transform duration-200 group-hover:scale-110 flex-shrink-0"
      priority
    />
  );
}
