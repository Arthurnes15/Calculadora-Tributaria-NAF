import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-naf-light">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-lg text-center rounded-3xl bg-white p-10 shadow-xl border border-naf-gray/20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-naf-red">404</p>
          <h1 className="mt-4 text-4xl font-bold text-naf-blue">Página não encontrada</h1>
          <p className="mt-4 text-lg text-naf-gray">
            A rota acessada não existe ou foi removida. Volte para a página inicial e continue sua simulação.
          </p>
          <Link
            to="/"
            className="mt-8 inline-block rounded-xl bg-naf-red px-6 py-3 font-bold text-white transition hover:bg-[#a62b18]"
          >
            Voltar ao início
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
