import { AiOutlineInstagram as InstagramIcon } from "react-icons/ai";
import { AiFillLinkedin as LinkedinIcon } from "react-icons/ai";
import { AiOutlineMail as EmailIcon } from "react-icons/ai";
import { BsChatFill as TalkIcon } from "react-icons/bs";
import LinkIcon from "@/components/LinkIcon";

const SocialIcons = ({ username }: { username: string }) => {
  return (
    <div className="flex flex-row mt-4 justify-center space-x-16 w-full">
      <LinkIcon href={`mailto:${username}@gmail.com`}>
        <EmailIcon />
      </LinkIcon>
      <LinkIcon href={`https://open.kakao.com/me/${username}`}>
        <TalkIcon />
      </LinkIcon>
      <LinkIcon href={`https://instagram.com/${username}`}>
        <InstagramIcon />
      </LinkIcon>
      <LinkIcon href={`https://linkedin.com/in/${username}`}>
        <LinkedinIcon />
      </LinkIcon>
    </div>
  );
};

export default SocialIcons;
