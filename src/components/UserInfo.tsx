import ProfileImage from "@components/ProfileImage";

function UserInfo() {
  return (
    <div className="flex flex-col items-center">
      <ProfileImage />
      <h2 className="font-bold text-lg">문지웅(@woongsnote)</h2>
      <p className="text-sm">Front-End Developer</p>
    </div>
  );
}

export default UserInfo;
