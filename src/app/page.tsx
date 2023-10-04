import ProfileCard from "@/components/ProfileCard";

const USER_NAME: string = "woongsnote";

export default function Home() {
  return (
    <>
      <main className="flex h-screen flex-col items-center mx-auto text-white">
        <ProfileCard username={USER_NAME} />
      </main>
      <footer className="bottom-0 w-full text-center pb-4 text-white px-2">
        <p> © 2023. 문지웅 | All rights reserved.</p>
      </footer>
    </>
  );
}
