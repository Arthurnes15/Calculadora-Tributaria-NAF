/**
 * Faixas do Anexo III do Simples Nacional.
 * Cada item segue o formato:
 * [RBT12 até (R$), alíquota nominal, parcela a deduzir (R$)]
 *
 * @type {Array<[number, number, number]>}
 */
const ANEXO_III = [
  [180000, 0.06, 0],
  [360000, 0.112, 9360],
  [720000, 0.135, 17640],
  [1800000, 0.16, 35640],
  [3600000, 0.21, 125640],
  [4800000, 0.33, 648000],
];

/**
 * Faixas do Anexo V do Simples Nacional.
 * Mesmo formato do Anexo III:
 * [RBT12 até (R$), alíquota nominal, parcela a deduzir (R$)]
 *
 * @type {Array<[number, number, number]>}
 */
const ANEXO_V = [
  [180000, 0.155, 0],
  [360000, 0.18, 4500],
  [720000, 0.195, 9900],
  [1800000, 0.205, 17100],
  [3600000, 0.23, 62100],
  [4800000, 0.305, 540000],
];

/**
 * Limite anual de receita bruta (RBT12) para permanência no Simples Nacional,
 * em reais.
 *
 * @type {number}
 */
export const LIMITE_SIMPLES = 4800000;

/**
 * Calcula o Fator R, define o Anexo do Simples Nacional aplicável
 * (III ou V) e a alíquota efetiva correspondente.
 *
 * O Fator R é a razão entre a folha de pagamento e a receita bruta, ambas
 * acumuladas nos últimos 12 meses. Se for >= 28%, a atividade é tributada
 * pelo Anexo III; caso contrário, pelo Anexo V.
 *
 * A alíquota efetiva é calculada pela fórmula do Simples Nacional:
 * `(RBT12 × alíquota nominal − parcela a deduzir) / RBT12`,
 * usando a faixa em que a receita de 12 meses se enquadra.
 *
 * @param {number} folha12 - Folha de pagamento acumulada nos últimos 12 meses
 *   (pró-labore, salários e encargos), em reais.
 * @param {number} receita12 - Receita bruta acumulada nos últimos 12 meses
 *   (RBT12), em reais. Deve ser maior que zero e não exceder
 *   {@link LIMITE_SIMPLES}.
 *
 * @returns {{ fatorR: number, anexo: "III" | "V", aliquotaEfetiva: number } | null}
 *   Objeto com:
 *   - `fatorR`: valor decimal do Fator R (ex.: 0.28 equivale a 28%);
 *   - `anexo`: "III" se `fatorR >= 0.28`, caso contrário "V";
 *   - `aliquotaEfetiva`: alíquota efetiva em decimal (ex.: 0.06 equivale a 6%).
 *
 *   Retorna `null` se `receita12` for inválida (ausente, zero, negativa)
 *   ou superior ao limite do Simples Nacional.
 *
 * @example
 * calcularFatorR(60000, 180000);
 * // { fatorR: 0.3333..., anexo: "III", aliquotaEfetiva: 0.06 }
 *
 * @example
 * calcularFatorR(20000, 180000);
 * // { fatorR: 0.1111..., anexo: "V", aliquotaEfetiva: 0.155 }
 *
 * @example
 * calcularFatorR(10000, 5000000);
 * // null (receita acima do limite do Simples Nacional)
 */
export function calcularFatorR(folha12, receita12) {
  if (!receita12 || receita12 <= 0 || receita12 > LIMITE_SIMPLES) return null;

  const fatorR = folha12 / receita12;
  const anexo = fatorR >= 0.28 ? "III" : "V";
  const tabela = anexo === "III" ? ANEXO_III : ANEXO_V;

  const [, nominal, deduzir] = tabela.find(([limite]) => receita12 <= limite);
  const aliquotaEfetiva = (receita12 * nominal - deduzir) / receita12;

  return { fatorR, anexo, aliquotaEfetiva };
}

/**
 * Formata uma alíquota decimal como porcentagem no padrão brasileiro,
 * com até 2 casas decimais.
 *
 * @param {number} valor - Alíquota em decimal (ex.: 0.06 ou 0.155).
 * @returns {string} Alíquota formatada (ex.: "6%" ou "15,5%").
 *
 * @example
 * formatarAliquota(0.06);  // "6%"
 *
 * @example
 * formatarAliquota(0.155); // "15,5%"
 */
export function formatarAliquota(valor) {
  return `${(valor * 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;
}