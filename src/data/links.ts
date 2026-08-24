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
    label: "Blog",
    description: "기록과 개발 이야기",
    url: "https://woongsnote.dev",
    ariaLabel: "블로그 열기",
    icon: "blog",
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    description: "코드와 작업 기록",
    url: "https://github.com/woongsnote",
    ariaLabel: "GitHub 프로필 열기",
    icon: "github",
    external: true,
  },
  {
    id: "email",
    label: "Email",
    description: "이메일로 연락하기",
    url: "mailto:woongsnote@gmail.com",
    ariaLabel: "문지웅에게 이메일 보내기",
    icon: "email",
    external: false,
  },
];
