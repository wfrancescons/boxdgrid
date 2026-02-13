import Footer from "@/components/Footer.tsx";
import Header from "@/components/Header.tsx";
import App from "@/islands/App.tsx";

export default function Home() {
  return (
    <>
      <div className="flex flex-col w-full min-h-dvh bg items-center">
        <Header />

        <main className="flex-1 flex items-center justify-center w-full p-6 md:p-0 min-h-0">
          <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-6 max-w-3xl w-full min-h-0">
            <App />
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
