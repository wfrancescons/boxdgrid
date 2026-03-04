import Footer from "@/components/Footer.tsx";
import Header from "@/components/Header.tsx";
import App from "@/islands/App.tsx";

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex min-h-0 w-full flex-1 items-center justify-center p-6">
        <div className="flex min-h-0 w-full max-w-3xl flex-col items-center justify-center gap-6 md:flex-row md:items-stretch">
          <App />
        </div>
      </main>

      <Footer />
    </>
  );
}
