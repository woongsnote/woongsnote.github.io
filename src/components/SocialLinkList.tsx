import { MyLinks } from "./Links";

function SocialLinkList() {
  return (
    <div className='flex flex-wrap gap-2'>
      {MyLinks.map((item, index) => (
        <a href={item.url} key={index} className='text-2xl'>
          {item.icon}
        </a>
      ))}
    </div>
  );
}

export default SocialLinkList;
