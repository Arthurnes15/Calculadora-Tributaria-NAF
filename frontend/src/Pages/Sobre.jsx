import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Sobre() {
  return (
    <div className="flex flex-col min-h-screen bg-naf-light">
      <Navbar />

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-12">
        <div className="rounded-3xl bg-white p-8 shadow-lg border border-naf-gray/20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-naf-red">Sobre o NAF</p>
          <h1 className="mt-3 text-4xl font-bold text-naf-blue">Núcleo de Apoio Financeiro</h1>

          <div className="mt-8 space-y-6 text-lg text-naf-gray leading-relaxed">
            <p>
              O NAF tem como missão orientar estudantes e profissionais sobre tributação, planejamento financeiro e tomada de decisão com base em dados reais e acessíveis.
            </p>
            <p>
              Esta calculadora foi desenvolvida para facilitar a comparação entre regimes de tributação e apoiar a escolha mais vantajosa para o perfil de cada pessoa.
            </p>
            <p>
              Em caso de dúvidas, entre em contato pelo e-mail: <a href="mailto:naf@unichristus.edu.br" className="font-bold text-naf-blue underline">naf@unichristus.edu.br</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
