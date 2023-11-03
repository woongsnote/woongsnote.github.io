import LinkItem from "./LinkItem";
import { MyLinks } from "./Links";
function LinkList() {
  return (
    <div className='flex flex-col w-full gap-4'>
      {MyLinks.map((item, index) => (
        <LinkItem key={index} title={item.title} url={item.url} />
      ))}
    </div>
  );
}

export default LinkList;
