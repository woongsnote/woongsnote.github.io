import Link from "next/link";
import { IconBaseProps } from "react-icons/lib";

interface LinkIconProps extends IconBaseProps {
  href: string;
}

const LinkIcon = ({ children, href }: LinkIconProps) => {
  return (
    <Link
      className="text-3xl p-2 hover:scale-125 transition ease-in-out delay-150 duration-300"
      href={href}
    >
      {children}
    </Link>
  );
};

export default LinkIcon;
