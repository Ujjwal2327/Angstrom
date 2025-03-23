import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <Image src="/icons/logo.png" alt="angstrom logo" width={25} height={25} />
    </Link>
  );
}
