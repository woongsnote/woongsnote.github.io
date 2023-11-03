import { TLinkItem } from "@lib/types";

function LinkItem({ title, url }: TLinkItem) {
  return (
    <a
      href={url}
      aria-label={`move to ${title}`}
      className='shadow-md w-full text-xl text-center p-1 bg-white rounded-md text-black font-bold hover:shadow-primary/50 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-500'>
      {title}
    </a>
  );
}

export default LinkItem;
