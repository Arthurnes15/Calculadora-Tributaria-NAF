import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
 // ADICIONADO: cálculo do Fator R e formatação da alíquota
import { calcularFatorR, formatarAliquota } from "../utils/fatorR";

export default function CalculoPJ() {
  const [renda, setRenda] = useState("");
  const [errors, setErrors] = useState({});
  const [resultado, setResultado] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const [mostrarEmail, setMostrarEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [mensagemEnvio, setMensagemEnvio] = useState("");
  const [profissao, setProfissao] = useState("psicologo");
  const [showTooltipRenda, setShowTooltipRenda] = useState(false);
  // Tooltip e valor do campo de pró-labore/folha (Fator R)
  const [showTooltipFolha, setShowTooltipFolha] = useState(false);
  const [folha12, setFolha12] = useState("");
  // ADICIONADO: receita bruta dos últimos 12 meses e seu tooltip
  const [receita12, setReceita12] = useState("");
  const [showTooltipReceita, setShowTooltipReceita] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const inputRendaMensalRef = useRef(null);
  const inputEmailRef = useRef(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Profissões que usam Fator R
  const profissoesFatorR = ["medico", "dentista"];

  const rendaNum = parseFloat(renda);

  const validateForm = () => {
    const newErrors = {};

    if (!rendaNum) {
      inputRendaMensalRef.current.focus();
      newErrors.renda = "Por favor, preencha o campo de renda.";
    } else if (rendaNum > 15000) {
      inputRendaMensalRef.current.focus();
      newErrors.renda = "A renda mensal máxima permitido é R$ 15.000,00";
    } else if (isNaN(rendaNum)) {
      inputRendaMensalRef.current.focus();
      newErrors.renda = "Por favor, insira valores válidos."; 
    }

    return newErrors;
  }

  const calcularPJ = async () => {
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    
    // Fator R, só para as profissões da lista
    let infoFatorR = null;
    if (profissoesFatorR.includes(profissao)) {
      const folhaNum = parseFloat(folha12);
      const receitaNum = parseFloat(receita12);
      if (isNaN(folhaNum) || folhaNum < 0 || isNaN(receitaNum)) {
        setResultado("Informe a folha de pagamento (com pró-labore) e a receita bruta dos últimos 12 meses.");
        return;
      }
      infoFatorR = calcularFatorR(folhaNum, receitaNum);
      if (!infoFatorR) {
        setResultado("A receita dos últimos 12 meses deve ser maior que zero e de até R$ 4.800.000 (limite do Simples Nacional).");
        return;
      }
    }

    setCarregando(true);
    try {
      const response = await api.post("/calculos", {
        tipoProfissao: profissao,
        faturamento: rendaNum,
        custos: 0,
        // ADICIONADO: o servidor usa a folha e a receita de 12 meses para o Fator R
        folha12: infoFatorR ? parseFloat(folha12) : undefined,
        receita12: infoFatorR ? parseFloat(receita12) : undefined
      });

      const { impostoPJ } = response.data.calculo;

      let simples = 0;
      let aliquota = "";

      if (profissao === "advogado") {
        simples = rendaNum * 0.045;
        aliquota = "4,5%";
      } else if (infoFatorR) {
        // ADICIONADO: alíquota efetiva pela tabela do anexo e pela receita dos 12 meses
        simples = rendaNum * infoFatorR.aliquotaEfetiva;
        aliquota = formatarAliquota(infoFatorR.aliquotaEfetiva);
      } else {
        simples = rendaNum * 0.06;
        aliquota = "6%";
      }

      const salario28 = rendaNum * 0.28;
      const salarioMin = 1621;
      const salarioBase = salario28 < salarioMin ? salarioMin : salario28;
      const inss = salarioBase * 0.11;

      setResultado({
        simples,
        aliquota,
        salarioBase,
        inss,
        total: infoFatorR ? simples + inss : impostoPJ,
        // Ficam undefined nas profissões sem Fator R
        fatorR: infoFatorR?.fatorR,
        anexo: infoFatorR?.anexo,
      });

      setMostrarEmail(false);
      setMensagemEnvio("");

    } catch (error) {
      console.error("Erro ao salvar cálculo PJ:", error);
      const msg = error.response?.data?.error || "Erro ao processar cálculo no servidor.";
      setResultado(msg);
    } finally {
      setCarregando(false);
    }
  };

  const enviarEmail = () => {
    const newErros = {};
    if (!email) {
      inputEmailRef.current.focus();
      newErros.email = "Por favor, preencha o campo de email";
      setErrors(newErros);
      return;
    } else if (!email.includes("@") || !email.includes(".")) {
      inputEmailRef.current.focus();
      newErros.email = "Por favor, insira um e-mail válido."
      setErrors(newErros);
      return;
    }

    setMensagemEnvio(`Resultados simulados e enviados para ${email} com sucesso!`);
    setErrors({});
    setEmail("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-naf-light">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className={`w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-naf-gray/20 transition-all duration-[700ms] ease-out delay-[200ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h2 className={`text-2xl font-bold text-center mb-6 text-naf-blue transition-all duration-[700ms] ease-out delay-[400ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
            Cálculo IR Pessoa Jurídica
          </h2>

          <div className="space-y-4">
            <div className={`transition-all duration-[700ms] ease-out delay-[500ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <label htmlFor="occupation" className="block mb-1 text-sm font-medium text-naf-blue">Profissão</label>
              <select id="occupation" value={profissao} onChange={(e) => setProfissao(e.target.value)} className="w-full border border-naf-gray px-4 py-2 rounded-xl focus:ring-2 focus:ring-naf-blue outline-none transition delay-[80ms] duration-[400ms] ease-in-out">
                <option value="psicologo">Psicólogo(a)</option>
                <option value="arquiteto">Arquiteto(a)</option>
                <option value="advogado">Advogado(a)</option>
                <option value="medico">Médico(a)</option>
                <option value="dentista">Dentista</option>
              </select>
            </div>

            <div className={`transition-all duration-[700ms] ease-out delay-[600ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <div className="relative flex items-center gap-1 mb-1">
                <label htmlFor="faturamento_mensal" className="text-sm font-medium text-naf-blue">Faturamento Mensal (R$)</label>
                <button type="button" 
                  className="text-naf-gray hover:text-naf-blue outline-none focus:ring-2 focus:ring-naf-blue focus:rounded-2xl" 
                  onClick={() => setShowTooltipRenda((visible) => !visible)} 
                  onMouseEnter={() => setShowTooltipRenda(true)} 
                  onMouseLeave={() => setShowTooltipRenda(false)}
                  aria-label="Visualizar a definição de faturamento mensal"
                  >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </button>
                {showTooltipRenda && (
                  <div className="absolute z-10 w-64 h-26 p-3 text-sm text-white bg-naf-blue rounded-xl shadow-lg left-12 bottom-8 lg:top-2 lg:left-full ml-2 border border-naf-gray/30">
                   Faturamento do mês que você quer simular. A receita dos últimos 12 meses é pedida à parte, só para o Fator R e a faixa do Simples.
                  </div>
                )}
              </div>
              <input id="faturamento_mensal" 
                type="number" 
                value={renda} 
                ref={inputRendaMensalRef}
                onChange={(e) => setRenda(e.target.value)} 
                max="15000" 
                placeholder="Ex: 3000" 
                className={`w-full border border-naf-gray px-4 py-2 rounded-xl focus:ring-2 focus:ring-naf-blue ${errors.renda ? "focus:ring-naf-red" : ""} outline-none transition delay-[80ms] duration-[400ms] ease-in-out hover:shadow-sm`}
                aria-invalid={errors.renda}
                aria-errormessage="erro_faturamento_mensal"
              />
              {errors.renda && <p id="erro_faturamento_mensal" className="text-naf-red text-sm mt-1 font-medium">{errors.renda}</p>}
            </div>  
            {/* ADICIONADO: campos que só aparecem para profissões com Fator R */}
            {profissoesFatorR.includes(profissao) && (
              <>
                <div>
                  <div className="relative flex items-center gap-1 mb-1">
                    <label className="text-sm font-medium text-naf-blue">Folha de pagamento + pró-labore dos últimos 12 meses (R$)</label>
                    <button type="button" className="text-naf-gray hover:text-naf-blue focus:outline-none" onMouseEnter={() => setShowTooltipFolha(true)} onMouseLeave={() => setShowTooltipFolha(false)}>
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {showTooltipFolha && (
                      <div className="absolute z-10 w-64 h-30 p-3 text-sm text-white bg-naf-blue rounded-xl shadow-lg left-12 bottom-8 lg:top-2 lg:left-full ml-2 border border-naf-gray/30">
                        Some, nos 12 meses anteriores, os salários brutos, o pró-labore dos sócios e os encargos (INSS patronal, FGTS, 13º e férias). Não entram distribuição de lucros nem aluguéis.
                      </div>
                    )}
                  </div>
                  <input type="number" min="0" value={folha12} onChange={(e) => setFolha12(e.target.value)} placeholder="Ex: 33600" className="w-full border border-naf-gray px-4 py-2 rounded-xl focus:ring-2 focus:ring-naf-red outline-none transition delay-[80ms] duration-[400ms] ease-in-out hover:shadow-sm" />
                </div>

                <div>
                  <div className="relative flex items-center gap-1 mb-1">
                    <label className="text-sm font-medium text-naf-blue">Receita bruta dos últimos 12 meses (R$)</label>
                    <button type="button" className="text-naf-gray hover:text-naf-blue focus:outline-none" onMouseEnter={() => setShowTooltipReceita(true)} onMouseLeave={() => setShowTooltipReceita(false)}>
                      <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {showTooltipReceita && (
                      <div className="absolute z-10 w-64 h-36 p-3 text-sm text-white bg-naf-blue rounded-xl shadow-lg left-12 bottom-8 lg:top-2 lg:left-full ml-2 border border-naf-gray/30">
                        Total faturado nos 12 meses anteriores, sem descontar despesas nem tributos. Dividindo a folha por esse valor, tem-se o Fator R: com 28% ou mais, Anexo III; abaixo disso, Anexo V.
                      </div>
                    )}
                  </div>
                  <input type="number" min="0" value={receita12} onChange={(e) => setReceita12(e.target.value)} placeholder="Ex: 120000" className="w-full border border-naf-gray px-4 py-2 rounded-xl focus:ring-2 focus:ring-naf-red outline-none transition delay-[80ms] duration-[400ms] ease-in-out hover:shadow-sm" />
                </div>
              </>
            )}

            <div className={`transition-all duration-[700ms] ease-out delay-[800ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <button onClick={calcularPJ} disabled={carregando} className="w-full bg-naf-blue text-white font-bold py-3 rounded-xl hover:bg-[#0c1825] hover:scale-105 transition-all duration-[400ms] ease-out shadow-md disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
                 {carregando ? "Calculando..." : "Calcular"}
              </button>
            </div>

            {resultado && (
              <div className={`bg-gray-50 border border-naf-gray/20 rounded-xl shadow-inner mt-4 p-5 transition-all duration-[700ms] ease-out delay-[200ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0"}`}>
                  <>
                    <div className="space-y-2 text-sm text-naf-blue">
                      <p><strong>Simples Nacional ({resultado.aliquota}):</strong> R$ {resultado.simples.toFixed(2)}</p>
                      <p><strong>Pró-labore base:</strong> R$ {resultado.salarioBase.toFixed(2)}</p>
                      <p><strong>INSS (11%):</strong> R$ {resultado.inss.toFixed(2)}</p>
                      {/* ADICIONADO: só aparece quando há Fator R */}
                      {resultado.fatorR !== undefined && (
                        <>
                          <p><strong>Fator R:</strong> {(resultado.fatorR * 100).toFixed(2)}%</p>
                          <p><strong>Anexo aplicado:</strong> Anexo {resultado.anexo}</p>
                        </>
                      )}
                    </div>
                    <p className="text-lg font-bold text-naf-red mt-3 pt-3 border-t border-naf-gray/30">
                      Total a pagar: R$ {resultado.total.toFixed(2)}
                    </p>

                    <div className="mt-5 pt-3 border-t border-naf-gray/30">
                      <p className="text-sm font-medium text-naf-blue mb-3 text-center">Deseja receber os resultados por e-mail?</p>
                      <div className="flex gap-3 justify-center">
                        <button onClick={() => setMostrarEmail(true)} className="bg-naf-blue text-white px-5 py-2 rounded-xl hover:bg-[#0c1825] transition shadow-sm text-sm font-medium">Sim</button>
                        <button onClick={() => setMostrarEmail(false)} className="bg-white border border-naf-gray text-naf-blue px-5 py-2 rounded-xl hover:bg-gray-100 transition shadow-sm text-sm font-medium">Não</button>
                      </div>

                      {mostrarEmail && (
                        <div className="mt-4 space-y-3">
                          <label htmlFor="email">Email</label>
                          <input type="email" 
                            value={email} 
                            ref={inputEmailRef}
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Digite seu e-mail" 
                            className={`w-full border border-naf-gray px-4 py-2 rounded-xl focus:ring-2 focus:ring-naf-blue ${errors.email ? "focus:ring-naf-red" : ""} outline-none text-sm`} 
                            aria-invalid={errors.email}
                            aria-errormessage="erro_email"
                          />
                          {errors.email && <p id="erro_email" className="text-naf-red text-sm font-medium">{errors.email}</p>}
                          <button onClick={enviarEmail} className="w-full bg-naf-red text-white py-2 rounded-xl hover:bg-[#a62b18] transition text-sm font-bold shadow-sm">Enviar resultados</button>
                        </div>
                      )}

                      {mensagemEnvio && <p className="text-green-600 mt-3 text-sm font-bold text-center">{mensagemEnvio}</p>}
                    </div>
                  </>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
