import Image from "next/image";

const ProfileImage = () => {
  return (
    <div className="rounded-full w-40 h-40 flex items-center justify-center border-white border-2 mt-4 sm:mt-6 m-4">
      <Image
        src={"/profile.png"}
        alt="profile"
        width={100}
        height={100}
        className="rounded-full w-auto h-auto"
        priority
      />
    </div>
  );
};

export default ProfileImage;
