import { profile } from "./profile";

export type LinkIcon = "blog" | "github" | "email";

export type LinkItem = {
  id: string;
  label: string;
  description: string;
  url: string;
  ariaLabel: string;
  icon: LinkIcon;
  external: boolean;
};

export const mainLinks: LinkItem[] = [
  {
    id: "blog",
    label: "Woongsnote",
    description: "기록과 개발 이야기",
    url: profile.website,
    ariaLabel: "블로그 열기",
    icon: "blog",
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    description: "코드와 작업 기록",
    url: profile.github,
    ariaLabel: "GitHub 프로필 열기",
    icon: "github",
    external: true,
  },
  {
    id: "email",
    label: "Email",
    description: "이메일로 연락하기",
    url: `mailto:${profile.email}`,
    ariaLabel: `${profile.name}에게 이메일 보내기`,
    icon: "email",
    external: false,
  },
];
