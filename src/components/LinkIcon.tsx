import Link from "next/link";
import { IconBaseProps } from "react-icons/lib";

interface LinkIconProps extends IconBaseProps {
  href: string;
}

const LinkIcon = ({ children, href }: LinkIconProps) => {
  return (
    <Link
      className="text-white text-3xl m-2 hover:scale-125 transition ease-in-out delay-150 duration-300 rounded-full shadow-md "
      href={href}
    >
      {children}
    </Link>
  );
};

export default LinkIcon;
