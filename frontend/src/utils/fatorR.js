// ADICIONADO: tabelas do Simples Nacional [RBT12 até, alíquota nominal, parcela a deduzir]
const ANEXO_III = [
  [180000, 0.06, 0],
  [360000, 0.112, 9360],
  [720000, 0.135, 17640],
  [1800000, 0.16, 35640],
  [3600000, 0.21, 125640],
  [4800000, 0.33, 648000],
];

const ANEXO_V = [
  [180000, 0.155, 0],
  [360000, 0.18, 4500],
  [720000, 0.195, 9900],
  [1800000, 0.205, 17100],
  [3600000, 0.23, 62100],
  [4800000, 0.305, 540000],
];

export const LIMITE_SIMPLES = 4800000;

// Fator R = folha de 12 meses ÷ receita bruta de 12 meses
export function calcularFatorR(folha12, receita12) {
  if (!receita12 || receita12 <= 0 || receita12 > LIMITE_SIMPLES) return null;
  const fatorR = folha12 / receita12;
  const anexo = fatorR >= 0.28 ? "III" : "V";
  const tabela = anexo === "III" ? ANEXO_III : ANEXO_V;
  const [, nominal, deduzir] = tabela.find(([limite]) => receita12 <= limite);
  const aliquotaEfetiva = (receita12 * nominal - deduzir) / receita12;
  return { fatorR, anexo, aliquotaEfetiva };
}

// 0.06 -> "6%" ; 0.155 -> "15,5%"
export function formatarAliquota(valor) {
  return `${(valor * 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;
}