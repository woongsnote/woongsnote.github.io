import Link from "next/link";

type LinkItemProps = {
  title: string;
  href: string;
};

const LinkItem = ({ href, title }: LinkItemProps) => {
  return <Link className="w-full text-blue-500 text-center font-bold rounded-lg px-2 py-3 my-4 shadow-lg transition ease-in-out delay-150 bg-white hover:-translate-y-1 hover:sm:scale-110 hover:bg-indigo-500 duration-300 hover:text-white" href={href}>{title}</Link>;
};

export default LinkItem;
