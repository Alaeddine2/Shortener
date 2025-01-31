import UrlList from "./url-list/UrlList";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <main>
      <UrlList></UrlList>
      <Toaster richColors />
    </main>
  );
}
