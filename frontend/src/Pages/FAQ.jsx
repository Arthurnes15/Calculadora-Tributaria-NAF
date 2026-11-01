import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const faqs = [
  {
    pergunta: "Para quem é esta calculadora?",
    resposta: "Foi desenvolvida especialmente para Psicólogos, Arquitetos e Advogados que desejam descobrir de forma rápida se é mais barato atuar como Pessoa Física ou abrir um CNPJ (Pessoa Jurídica).",
  },
  {
    pergunta: "Quais tributos são considerados no comparativo?",
    resposta: "Para Pessoa Física, utilizamos a Tabela Progressiva do IRPF abatendo as despesas do Livro Caixa. Para Pessoa Jurídica, aplicamos as alíquotas do Simples Nacional (Anexos III ou IV, dependendo da profissão) e o INSS obrigatório sobre o Pró-labore.",
  },
  {
    pergunta: "Vale a pena abrir CNPJ ganhando pouco?",
    resposta: "Muitas vezes, sim! É um mito que CNPJ é só para quem ganha muito. O nosso comparativo vai te mostrar o ponto de virada onde os 27,5% da Pessoa Física se tornam mais caros que os impostos do Simples Nacional.",
  },
  {
    pergunta: "O que é o Fator R que o sistema menciona?",
    resposta: "O Fator R é uma regra do Simples Nacional que afeta Psicólogos e Arquitetos. Ela diz que se a sua folha de pagamento (incluindo seu pró-labore) for igual ou maior que 28% do faturamento, seu imposto cai para 6% (Anexo III). A nossa ferramenta já faz esse cálculo automaticamente para você!",
  },
  {
    pergunta: "A calculadora substitui um contador?",
    resposta: "Não. A calculadora é uma ferramenta de simulação e tomada de decisão tributária. Após descobrir o regime mais vantajoso, é fundamental contratar um contador habilitado para realizar a abertura da empresa e gerir as obrigações fiscais.",
  },
  {
    pergunta: "Qual é o ano-base dos cálculos da ferramenta?",
    resposta: "Todos os cálculos, limites de isenção e o salário mínimo vigente (R$ 1.621,00) estão projetados e atualizados rigorosamente para o ano-calendário de 2026.",
  },
];

export default function FAQ() {
  return (
    <div className="flex flex-col min-h-screen bg-naf-light">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 py-12">
        <div className="mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-naf-red">FAQ</p>
          <h1 className="mt-3 text-4xl font-bold text-naf-blue">Perguntas frequentes</h1>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="rounded-2xl border border-naf-gray/20 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-naf-blue">{faq.pergunta}</h2>
              <p className="mt-3 text-base leading-relaxed text-naf-gray">{faq.resposta}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
