import profile from "@assets/profile.png";

function ProfileImage() {
  return (
    <img
      src={profile}
      alt='profile image'
      className='w-24 h-24 rounded-xl p-2'
    />
  );
}

export default ProfileImage;
