/**
 * Calcula o Fator R e determina o Anexo do Simples Nacional aplicável.
 *
 * O Fator R é a razão entre a folha de pagamento (incluindo pró-labore,
 * salários e encargos) e a receita bruta, ambas acumuladas nos últimos
 * 12 meses. Para atividades como as de médicos e dentistas (serviços
 * sujeitos ao Fator R), ele define a tributação:
 *
 * - Fator R >= 28%: tributação pelo Anexo III (alíquotas iniciais menores,
 *   a partir de 6%).
 * - Fator R < 28%: tributação pelo Anexo V (alíquotas iniciais maiores,
 *   a partir de 15,5%).
 *
 * @param {number} folha - Total da folha de pagamento no período
 *   (pró-labore + salários + encargos patronais como INSS e FGTS).
 *   Deve usar a mesma base de tempo da renda (ex.: ambos mensais ou
 *   ambos acumulados em 12 meses).
 * @param {number} rendaMensal - Receita bruta no mesmo período da folha.
 *   Deve ser maior que zero.
 *
 * @returns {{ fatorR: number, anexo: "III" | "V" } | null}
 *   Objeto com:
 *   - `fatorR`: valor decimal do Fator R (ex.: 0.28 equivale a 28%);
 *   - `anexo`: "III" se `fatorR >= 0.28`, caso contrário "V".
 *   Retorna `null` se `rendaMensal` for inválida (ausente, zero ou negativa).
 *
 * @example
 * calcularFatorR(3000, 10000);
 * // { fatorR: 0.3, anexo: "III" }
 *
 * @example
 * calcularFatorR(2000, 10000);
 * // { fatorR: 0.2, anexo: "V" }
 *
 * @example
 * calcularFatorR(2000, 0);
 * // null
 */

export const calcularFatorR = (folha, rendaMensal) => {
  if (!rendaMensal || rendaMensal <= 0) return null;

  const fatorR = folha / rendaMensal;
  const anexo = fatorR >= 0.28 ? "III" : "V";

  return { fatorR, anexo };
};