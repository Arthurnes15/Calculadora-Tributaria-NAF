import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { calcularFatorR } from "../utils/calcularFatorR";

function CalculoPF() {
  const [renda, setRenda] = useState("");
  const [custos, setCustos] = useState("");
  const [resultado, setResultado] = useState(null);
  const [errors, setErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  const [mostrarEmail, setMostrarEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [mensagemEnvio, setMensagemEnvio] = useState("");
  const [showTooltipRenda, setShowTooltipRenda] = useState(false);
  const [showTooltipCustos, setShowTooltipCustos] = useState(false);
  const [profissao, setProfissao] = useState("psicologo");
  // Tooltip e valor do campo de pró-labore/folha (Fator R)
  const [showTooltipFolha, setShowTooltipFolha] = useState(false);
  const [folhaMensal, setFolhaMensal] = useState("");
  /*
    As variáveis abaixo (inputRendaMensalRef, inputCustosRef, inputFolhaMensalRef, inputEmailRef), são usadas no alerta das mensagens de erro pelos leitores de tela. O hook useRef pode ser usado particularmente para manipular a DOM. Nesse contexto de acessiblidade, os leitores de tela só conseguem ler as mensagens de erro se os inputs (com erros) estiverem com o atributo focus ativo, portanto, na ocorrência de algum erro, através das variáveis abaixo o atributo focus é ativado nos respectivos inputs.

    Para mais detalhes do hook useRef, consulte sua documentação no link abaixo: 
    https://react.dev/reference/react/useRef
  */
  const inputRendaMensalRef = useRef(null);
  const inputCustosRef = useRef(null);
  const inputFolhaMensalRef = useRef(null);
  const inputEmailRef = useRef(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Profissões que usam Fator R
  const profissoesFatorR = ["medico", "dentista"];

  const rendaNum = parseFloat(renda);
  const custosNum = parseFloat(custos);
  const folhaNum = parseFloat(folhaMensal);

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
      newErrors.custos = "Por favor, insira valores válidos."; 
    }
  
    if (!custosNum) {
      inputCustosRef.current.focus();
      newErrors.custos = "Por favor, preencha o campo de despesas.";
    } else if (isNaN(custosNum)) {
      inputCustosRef.current.focus();
      newErrors.custos = "Por favor, insira valores válidos."; 
    }

    if (profissoesFatorR.includes(profissao)) {
      if (!folhaNum) {
        inputFolhaMensalRef.current.focus();
        newErrors.folhaMensal = "Por favor, insira a despesa mensal com pró-labore/folha de pagamento.";
      } else if (isNaN(folhaNum)) {
        inputFolhaMensalRef.current.focus();
        newErrors.folhaMensal = "Por favor, insira valores válidos."; 
      }
    }

    return newErrors;
  };

  const calcularIRPF = async () => {
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});

    // Fator R, só para as profissões da lista
    let infoFatorR = null;
    if (profissoesFatorR.includes(profissao)) {
      infoFatorR = calcularFatorR(folhaNum, rendaNum);
    }

    try {
      const response = await api.post("/calculos", {
        tipoProfissao: profissao,
        faturamento: rendaNum,
        custos: custosNum,
        folhaMensal: infoFatorR ? folhaNum : undefined,
      });

      const { impostoPF } = response.data.calculo;
      const base = rendaNum - custosNum;

      let faixa = "Isento";
      let parcelaDedutivel = 0;

      if (base <= 2428.8) faixa = "Isento";
      else if (base <= 2826.65) { faixa = "7,5%"; parcelaDedutivel = 182.16; }
      else if (base <= 3751.05) { faixa = "15%"; parcelaDedutivel = 394.16; }
      else if (base <= 4664.68) { faixa = "22,5%"; parcelaDedutivel = 675.49; }
      else { faixa = "27,5%"; parcelaDedutivel = 908.73; }

      setResultado({
        base,
        faixa,
        imposto: impostoPF,
        parcelaDedutivel,
        fatorR: infoFatorR?.fatorR,
        anexo: infoFatorR?.anexo,
      });

      setMostrarEmail(false);
      setMensagemEnvio("");

    } catch (error) {
      console.error("Erro ao salvar cálculo PF:", error);
      const msg = error.response?.data?.error || "Erro ao processar cálculo no servidor.";
      setResultado(msg);
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
      <main className="grow flex flex-col items-center justify-center p-6">
        <div className={`w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-naf-gray/20 transition-all duration-[700ms] ease-out delay-[100ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className={`text-2xl font-bold text-center mb-6 text-naf-blue transition-all duration-[700ms] ease-out delay-[300ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
            Cálculo IR Pessoa Física
          </h2>

          <div className="space-y-4">
            <div className={`transition-all duration-[700ms] ease-out delay-[500ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
              <label htmlFor="profissao" className="block mb-1 text-sm font-medium text-naf-blue">Profissão</label>
              <select id="profissao" value={profissao} onChange={(e) => setProfissao(e.target.value)} className="w-full border border-naf-gray px-4 py-2 rounded-xl focus:ring-2 focus:ring-naf-blue outline-none transition delay-[80ms] duration-[400ms] ease-in-out">
                <option value="psicologo">Psicólogo(a)</option>
                <option value="arquiteto">Arquiteto(a)</option>
                <option value="advogado">Advogado(a)</option>
                <option value="medico">Médico(a)</option>
                <option value="dentista">Dentista</option>
              </select>
            </div>

            <div className={`transition-all duration-[700ms] ease-out delay-[600ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
              <div className="relative flex items-center gap-1 mb-1">
                <label htmlFor="renda_mensal" className="text-sm font-medium text-naf-blue">Renda Mensal Bruta (R$)</label>
                <button type="button" 
                  className="text-naf-gray hover:text-naf-blue focus:outline-none focus:ring-2 focus:ring-naf-blue focus:rounded-2xl" 
                  onClick={() => setShowTooltipRenda((visible) => !visible)} 
                  onMouseEnter={() => setShowTooltipRenda(true)} 
                  onMouseLeave={() => setShowTooltipRenda(false)}
                  aria-label="Visualizar definição de renda mensal bruta"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </button>
                {showTooltipRenda && (
                  <div className="absolute z-10 w-64 h-20 p-3 text-sm text-white bg-naf-blue rounded-xl shadow-lg left-15 bottom-8 lg:top-2 lg:left-full ml-2 border border-naf-gray/30">
                    É o valor total que você espera receber por mês com o seu trabalho, antes de qualquer desconto.
                  </div>
                )}
              </div>
              <input id="renda_mensal"
                type="number"
                value={renda} 
                ref={inputRendaMensalRef}
                onChange={(e) => setRenda(e.target.value)} 
                max="15000"
                placeholder="Ex: 3000" 
                className={`w-full border border-naf-gray px-4 py-2 rounded-xl focus:ring-2 focus:ring-naf-blue ${errors.renda ? "focus:ring-naf-red" : ""} outline-none transition delay-[80ms] duration-[400ms] ease-in-out hover:shadow-sm`}
                aria-invalid={errors.renda}
                aria-errormessage="erro_renda_mensal"
              />
              {errors.renda && <p id="erro_renda_mensal" className="text-naf-red text-sm mt-1 font-medium">{errors.renda}</p>}
            </div>

            <div className={`transition-all duration-[700ms] ease-out delay-[700ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
              <div className="relative flex items-center gap-1 mb-1">
                <label htmlFor="custos_dedutiveis" className="text-sm font-medium text-naf-blue">Despesas Dedutíveis (Livro Caixa)</label>
                <button type="button" 
                  className="text-naf-gray hover:text-naf-blue focus:outline-none focus:ring-2 focus:ring-naf-blue focus:rounded-2xl"
                  onClick={() => setShowTooltipCustos((visible) => !visible)} 
                  onMouseEnter={() => setShowTooltipCustos(true)} 
                  onMouseLeave={() => setShowTooltipCustos(false)}
                  aria-label="Visualizar definição de despesas dedutíveis"
                  >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </button>
                {showTooltipCustos && (
                  <div className="absolute z-10 w-64 h-30 p-3 text-sm text-white bg-naf-blue rounded-xl shadow-lg left-15 bottom-8 lg:top-2 lg:left-full ml-2 border border-naf-gray/30"
                  >
                    São os gastos essenciais para o seu trabalho acontecer (ex: aluguel de consultório/escritório, internet, energia). Eles reduzem a base de cálculo do imposto.
                  </div>
                )}
              </div>
              <input id="custos_dedutiveis" 
                type="number"
                value={custos} 
                ref={inputCustosRef}
                onChange={(e) => setCustos(e.target.value)} 
                placeholder="Ex: 750" 
                className={`w-full border border-naf-gray px-4 py-2 rounded-xl focus:ring-2 focus:ring-naf-blue ${errors.custos ? "focus:ring-naf-red" : ""} outline-none transition delay-[80ms] duration-[400ms] ease-in-out hover:shadow-sm`}
                aria-invalid={errors.custos}
                aria-errormessage="erro_custos_dedutiveis"
              />
              {errors.custos && <p id="erro_custos_dedutiveis" className="text-naf-red text-sm mt-1 font-medium">{errors.custos}</p>}
            </div>

            {/* Campo que só aparece para profissões com Fator R */}
            {profissoesFatorR.includes(profissao) && (
              <div>
                <div className="relative flex items-center gap-1 mb-1">
                  <label htmlFor="folha_mensal"  className="text-sm font-medium text-naf-blue">Despesa mensal com pró-labore/Folha de pagamento(R$)</label>
                  <button type="button" 
                    className="text-naf-gray hover:text-naf-blue outline-none focus:ring-2 focus:ring-naf-blue focus:rounded-2xl" 
                    onClick={() => setShowTooltipFolha((visible) => !visible)} 
                    onMouseEnter={() => setShowTooltipFolha(true)} 
                    onMouseLeave={() => setShowTooltipFolha(false)}
                  >
                    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {showTooltipFolha && (
                    <div className="absolute z-10 w-64 h-35 p-3 text-sm text-white bg-naf-blue rounded-xl shadow-lg left-15 bottom-8 lg:top-2 lg:left-full ml-2 border border-naf-gray/30">
                      É o que você paga por mês em salários, encargos e pró-labore. Esse valor dividido pela renda mensal bruta forma o Fator R: com 28% ou mais, aplica-se o Anexo III; abaixo disso, o Anexo V.
                    </div>
                  )}
                </div>
                <input id="folha_mensal"
                  type="number"
                  value={folhaMensal} 
                  ref={inputFolhaMensalRef}
                  onChange={(e) => setFolhaMensal(e.target.value)} 
                  placeholder="Ex: 2800" 
                  className={`w-full border border-naf-gray px-4 py-2 rounded-xl focus:ring-2 focus:ring-naf-blue ${errors.folhaMensal ? "focus:ring-naf-red" : ""} outline-none transition delay-[80ms] duration-[400ms] ease-in-out hover:shadow-sm`} 
                  aria-invalid={errors.folhaMensal}
                  aria-errormessage="erro_folha_mensal"
                />
                {errors.folhaMensal && <p id="erro_folha_mensal" className="text-naf-red text-sm mt-1 font-medium">{errors.folhaMensal}</p>}
              </div>
            )}

            <div className={`transition-all duration-[700ms] ease-out delay-[900ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
              <button onClick={calcularIRPF} className="w-full bg-naf-blue text-white font-bold py-3 rounded-xl hover:bg-[#0c1825] hover:scale-105 outline-none focus:ring-4 focus:ring-naf-red  transition-all duration-[400ms] ease-out shadow-md">
                Calcular
              </button>
            </div>

            {resultado && (
              <div className={`bg-gray-50 border border-naf-gray/20 rounded-xl shadow-inner mt-4 p-5 transition-all duration-[400ms] ease-out ${isVisible ? "opacity-100" : "opacity-0"}`}>
                  <>
                    <div className="space-y-2 text-sm text-naf-blue">
                      <p><strong>Base de cálculo:</strong> R$ {resultado.base.toFixed(2)}</p>
                      <p><strong>Faixa IRPF:</strong> {resultado.faixa}</p>
                      <p><strong>Parcela a deduzir:</strong> R$ {resultado.parcelaDedutivel.toFixed(2)}</p>
                      {/* ADICIONADO: só aparece quando há Fator R */}
                      {resultado.fatorR !== undefined && (
                        <>
                          <p><strong>Fator R:</strong> {(resultado.fatorR * 100).toFixed(2)}%</p>
                          <p><strong>Anexo aplicado:</strong> Anexo {resultado.anexo}</p>
                        </>
                      )}
                    </div>
                    <p className="text-lg font-bold text-naf-red mt-3 pt-3 border-t border-naf-gray/30">
                      IR a pagar: R$ {resultado.imposto.toFixed(2)}
                    </p>
                    <div className="mt-5 pt-3 border-t border-naf-gray/30">
                      <p className="text-sm font-medium text-naf-blue mb-3 text-center">Deseja enviar essa simulação por e-mail?</p>
                      <div className="flex gap-3 justify-center">
                        <button onClick={() => setMostrarEmail(true)} className="bg-naf-blue text-white px-5 py-2 rounded-xl hover:bg-[#0c1825] transition shadow-sm text-sm font-medium">Sim, enviar</button>
                        <button onClick={() => setMostrarEmail(false)} className="bg-white border border-naf-gray text-naf-blue px-5 py-2 rounded-xl hover:bg-gray-100 transition shadow-sm text-sm font-medium">Não, obrigado</button>
                      </div>
                      
                      {mostrarEmail && (
                        <div className="mt-4 space-y-3">
                          <label htmlFor="email">Email</label>
                          <input
                            id="email"
                            type="email"
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

export default CalculoPF;
