import { Appbar } from "@/components/Appbar";

import LandingPage from "@/components/LandingPage";
import { Redirect } from "@/components/redirect";

export default function Home() {
  return (
    <div>

      <Appbar />

      <Redirect />
      <LandingPage />
    </div>
  );
}
