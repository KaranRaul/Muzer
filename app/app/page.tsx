import { Appbar } from "@/components/Appbar";
import Image from "next/image";
import { Provider } from "./provider";
import LandingPage from "@/components/LandingPage";
import { Redirect } from "@/components/redirect";
import { SessionProvider } from "next-auth/react";

export default function Home() {
  return (
    <div>

      <Appbar />

      <Redirect />
      <LandingPage />
    </div>
  );
}
