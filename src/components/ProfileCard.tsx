import SocialIcons from "./SocialIcons";
import UserInfo from "./UserInfo";
import UserLinks from "./UserLinks";

const ProfileCard = ({ username }: { username: string }) => {
  return (
    <div className="w-full space-y-8 max-w-lg px-4 items-center flex flex-col">
      <UserInfo username={username} />
      <UserLinks username={username} />
      <SocialIcons username={username} />
    </div>
  );
};

export default ProfileCard;
