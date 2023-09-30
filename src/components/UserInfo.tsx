import ProfileImage from "./ProfileImage";

const UserInfo = ({ username }: { username: string }) => {
  return (
    <div className="w-full items-center flex flex-col">
      <ProfileImage />
      <span className="text-xl font-extrabold my-4">@{username}</span>
      <span className="my-4 text-lg font-bold">Front-End Developer</span>
    </div>
  );
};

export default UserInfo;
