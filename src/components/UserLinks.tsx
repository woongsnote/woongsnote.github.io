import LinkItem from "./LinkItem";

const UserLinks = ({ username }: { username: string }) => {
  return (
    <>
      <LinkItem title="GitHub" href={`https://github.com/${username}`} />
      <LinkItem title="Blog" href={`https://${username}.dev`} />
      <LinkItem
        title="Portfoilo"
        href={`https://woongs-portfolio.vercel.app`}
      />
    </>
  );
};

export default UserLinks;
