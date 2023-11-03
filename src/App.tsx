import LinkList from "@components/LinkList";
import SocialLinkList from "@components/SocialLinkList";
import UserInfo from "@components/UserInfo";

function App() {
  return (
    <div className='flex flex-col min-h-screen bg-bkg text-white p-2'>
      <div className='container mx-auto max-w-xs flex flex-col items-center gap-4 rounded-lg px-4 m-1 py-2 flex-grow'>
        <UserInfo />
        <SocialLinkList />
        <hr className='w-full bg-white' />
        <LinkList />
      </div>
    </div>
  );
}

export default App;
