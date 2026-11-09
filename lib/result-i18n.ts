/**
 * Result-string translation for the calculator tools.
 *
 * Warnings, notes and remedy flags come from the rules engines as finite
 * English template sets. This module maps the known strings to Spanish
 * at render time; anything not in the dictionary falls back to English
 * (edge cases and interpolated values keep the original text).
 */

const ES_RESULT_COPY: Record<string, string> = {
  // rvc-calculator warnings
  "Net cost method selected but no net cost was provided - this result is computed on transaction value and is NOT a valid net-cost calculation (USMCA Article 4.5(2): net cost = total cost less sales promotion, marketing and after-sales service costs, royalties, shipping and packing costs, and non-allowable interest costs).":
    "Seleccionaste el método de costo neto pero no ingresaste un costo neto: este resultado está calculado sobre el valor de transacción y NO es un cálculo válido de costo neto (Artículo 4.5(2) del T-MEC: costo neto = costo total menos promoción de ventas, marketing y servicio posventa, regalías, costos de embalaje y transporte, e interés no permitido).",
  "Net cost is higher than the transaction value - net cost excludes profit, so it usually sits below the sale price. Double-check which figure was entered where.":
    "El costo neto es mayor que el valor de transacción: el costo neto excluye la utilidad, así que normalmente queda por debajo del precio de venta. Verifica qué cifra quedó en cada campo.",
  "Transaction value must be greater than zero.":
    "El valor de transacción debe ser mayor que cero.",
  "Line item values differ from transaction value by more than 2% - double check your BOM totals before relying on this result.":
    "Los valores de las partidas difieren del valor de transacción por más del 2%: revisa los totales de tu lista de materiales antes de confiar en este resultado.",
  "This result is within 3 percentage points of the threshold - a small sourcing change could flip the outcome. Consider a wider margin before certifying.":
    "Este resultado está a menos de 3 puntos porcentuales del umbral: un cambio pequeño de abastecimiento puede voltear el resultado. Considera un margen más amplio antes de certificar.",
  // de minimis notes
  "De minimis (USMCA Article 4.12) applies only to the non-originating materials that fail a required tariff-shift test - it doesn't raise your RVC threshold, and those materials still count as non-originating in the RVC result above.":
    "El minimis (Artículo 4.12 del T-MEC) aplica solo a los materiales no originarios que fallan una prueba de cambio de clasificación exigida: no sube tu umbral de RVC, y esos materiales siguen contando como no originarios en el resultado de RVC de arriba.",
  "The treaty test is 10% of the transaction value (adjusted to exclude international shipment costs) or, where the net cost method applies, 10% of the total cost of the good - this check uses transaction value as a conservative reference.":
    "La prueba del tratado es 10% del valor de transacción (ajustado para excluir costos de envío internacional) o, donde aplica el método de costo neto, 10% del costo total del bien: esta verificación usa el valor de transacción como referencia conservadora.",
  "Textiles and apparel (HS chapters 50-63) use a different, weight-based de minimis test instead of this value-based one (10% of total weight, with elastomeric content capped at 7% of total weight).":
    "Los textiles y prendas de vestir (capítulos 50-63 del SA) usan una prueba de minimis distinta, basada en peso, en lugar de esta basada en valor (10% del peso total, con contenido elastomérico limitado al 7% del peso total).",
  "Certain dairy products and infant formula used as inputs are excluded from de minimis treatment entirely.":
    "Ciertos productos lácteos y fórmulas infantiles usados como insumos quedan excluidos por completo del tratamiento de minimis.",
  // trade-remedy flags
  "Section 232 steel: 50% applies even if USMCA-qualifying":
    "Sección 232 acero: el 50% aplica incluso si califica bajo el T-MEC",
  "Section 232 aluminum: 50% applies even if USMCA-qualifying":
    "Sección 232 aluminio: el 50% aplica incluso si califica bajo el T-MEC",
  "Section 301 China: 7.5-25% if this good is China-origin":
    "Sección 301 China: 7.5-25% si el bien es de origen chino",
  "AD/CVD: antidumping and countervailing orders may stack":
    "AD/CVD: las órdenes antidumping y compensatorias pueden acumularse",
  "2026 measure turbulence: sectoral measures are moving":
    "Turbulencia de medidas 2026: las medidas sectoriales se están moviendo",
  "232 steel 50%": "232 acero 50%",
  "232 aluminum 50%": "232 aluminio 50%",
  "301 China 7.5-25%": "301 China 7.5-25%",
  "AD/CVD check": "revisión AD/CVD",
  "Measure volatility": "volatilidad de medidas",
  "Section 232 steel duties stand at 50% and USMCA does not constrain Section 232: a steel good (HS chapters 72-73) pays 232 even when it qualifies as USMCA-originating. Downstream articles on the 232 derivative list can also be caught. Verify the 10-digit HTS against current 232 inclusions and any product-specific exclusions.":
    "Los derechos de la Sección 232 de acero están en 50% y el T-MEC no limita la Sección 232: un bien de acero (capítulos 72-73 del SA) paga 232 incluso cuando califica como originario del T-MEC. Los artículos derivados en la lista 232 también pueden quedar atrapados. Verifica el HTS de 10 dígitos contra las inclusiones 232 vigentes y cualquier exclusión específica de producto.",
  "Section 232 aluminum duties stand at 50% and USMCA does not constrain Section 232: an aluminum good (HS chapter 76) pays 232 even when it qualifies as USMCA-originating. Downstream articles on the 232 derivative list can also be caught. Verify the 10-digit HTS against current 232 inclusions and any product-specific exclusions.":
    "Los derechos de la Sección 232 de aluminio están en 50% y el T-MEC no limita la Sección 232: un bien de aluminio (capítulo 76 del SA) paga 232 incluso cuando califica como originario del T-MEC. Los artículos derivados en la lista 232 también pueden quedar atrapados. Verifica el HTS de 10 dígitos contra las inclusiones 232 vigentes y cualquier exclusión específica de producto.",
  "Section 301 duties (7.5-25% across Lists 1-4A) apply to China-origin goods regardless of USMCA planning. If this good qualifies under USMCA and enters from Canada or Mexico, its origin is not China and 301 does not apply to the finished good - but a non-qualifying China-origin import carries 301 on top of the MFN duty.":
    "Los derechos de la Sección 301 (7.5-25% en las Listas 1-4A) aplican a bienes de origen chino independientemente de la planeación del T-MEC. Si este bien califica bajo el T-MEC y entra desde Canadá o México, su origen no es China y el 301 no aplica al bien terminado; pero una importación de origen chino que no califica carga el 301 encima del arancel NMF.",
  "Antidumping and countervailing duty orders apply per 8-digit HTS and country and stack on everything above. Check your exact tariff item and origin in the ITA enforcement database at enforce.trade.gov - this tool does not track order scope.":
    "Las órdenes de derechos antidumping y compensatorios aplican por partida HTS de 8 dígitos y por país, y se acumulan sobre todo lo anterior. Revisa tu partida arancelaria exacta y tu origen en la base de datos de aplicación de la ITA en enforce.trade.gov: esta herramienta no rastrea el alcance de las órdenes.",
  "Sectoral measures have been changing fast in 2026, including new Section 338 duties on selected Canadian goods and recurring 232 list updates. Confirm the current status of any measure with your broker before relying on an estimate.":
    "Las medidas sectoriales han cambiado rápido en 2026, incluidos nuevos derechos de la Sección 338 sobre bienes canadienses seleccionados y actualizaciones recurrentes de las listas 232. Confirma el estado vigente de cualquier medida con tu agente aduanal antes de confiar en una estimación.",
  // duty-savings
  "This good did not meet the threshold in the calculation above - savings only apply once it qualifies as USMCA-originating and a valid certification of origin accompanies the entry.":
    "Este bien no alcanzó el umbral en el cálculo de arriba: el ahorro solo aplica una vez que califique como originario del T-MEC y una certificación de origen válida acompañe la entrada.",
  "MFN duty: enter the General (column 1) rate from the HTSUS for your 10-digit tariff item. USMCA-qualifying goods enter duty-free instead.":
    "Arancel NMF: ingresa la tasa General (columna 1) del HTSUS para tu partida de 10 dígitos. Los bienes que califican bajo el T-MEC entran libres de arancel.",
  "Surcharge layer: enter any universal import surcharge currently in force, 0 if none. For reference, the Section 122 10% surcharge (Feb 24 - Jul 24, 2026) explicitly exempted USMCA-qualifying goods and expired July 24, 2026 by operation of law.":
    "Capa de recargo: ingresa cualquier recargo universal de importación vigente, 0 si no hay. Como referencia, el recargo del 10% de la Sección 122 (24 feb - 24 jul 2026) eximía expresamente a los bienes calificantes del T-MEC y expiró el 24 de julio de 2026 por operación de ley.",
  "Merchandise Processing Fee: US entries pay 0.3464% ad valorem with a minimum of $33.58 and a maximum of $651.50 per entry (FY 2026 figures). USMCA-originating goods from Canada or Mexico are exempt from MPF.":
    "Merchandise Processing Fee: las entradas de EE. UU. pagan 0.3464% ad valorem con mínimo de $33.58 y máximo de $651.50 por entrada (cifras del año fiscal 2026). Los bienes originarios del T-MEC desde Canadá o México están exentos de la MPF.",
  "The Merchandise Processing Fee is shown as zero because the importing party is not the United States. Canada and Mexico apply their own import processing fees, which this estimate does not model.":
    "La Merchandise Processing Fee se muestra en cero porque la parte importadora no es Estados Unidos. Canadá y México aplican sus propias tarifas de procesamiento de importación, que esta estimación no modela.",
  "USMCA preference does NOT waive Section 232 steel/aluminum duties, Section 301 China-action duties, or antidumping/countervailing duties - those still apply to USMCA-originating goods.":
    "La preferencia del T-MEC NO elimina los derechos de la Sección 232 de acero/aluminio, los de la Sección 301 contra China, ni los antidumping/compensatorios: esos siguen aplicando a bienes originarios del T-MEC.",
  "Estimate only. Actual landed cost depends on your entered rate, valuation basis and current trade actions - confirm with your customs broker before relying on these figures.":
    "Solo una estimación. El costo real puesto en destino depende de la tasa que ingreses, la base de valoración y las acciones comerciales vigentes: confírmalo con tu agente aduanal antes de confiar en estas cifras.",
  // origin-engineering notes
  "This good already qualifies. The headroom is how much more non-originating content it could absorb before falling below the threshold, holding the denominator constant.":
    "Este bien ya califica. La holgura es cuánto contenido no originario adicional podría absorber antes de caer por debajo del umbral, manteniendo fijo el denominador.",
  "Headroom assumes transaction value (or net cost) does not change when sourcing changes - if a swap changes the denominator, re-run the full calculation.":
    "La holgura asume que el valor de transacción (o el costo neto) no cambia al cambiar el abastecimiento: si un cambio altera el denominador, repite el cálculo completo.",
  "Swap suggestions are arithmetic what-ifs: replacing a non-originating input with one that is itself USMCA-originating. The replacement input must actually qualify as originating - imported parts from Canada or Mexico do not qualify automatically.":
    "Las sugerencias de cambio son escenarios aritméticos: reemplazar un insumo no originario por uno que sea en sí mismo originario del T-MEC. El insumo de reemplazo debe calificar realmente como originario: las partes importadas de Canadá o México no califican automáticamente.",
  "A swap can also change whether the tariff-shift test is satisfied - re-check the tariff-shift side separately.":
    "Un cambio también puede alterar si se cumple la prueba de cambio de clasificación: revisa ese lado por separado.",
  "If the only failing part is a tariff shift on a small input, the Article 4.12 de minimis allowance (10%) may rescue the qualification without any sourcing change.":
    "Si lo único que falla es un cambio de clasificación sobre un insumo pequeño, la tolerancia de minimis del Artículo 4.12 (10%) puede rescatar la calificación sin cambiar el abastecimiento.",
  "No single component swap closes the gap - it will take a combination. The dollar gap below is the total originating value to add.":
    "Ningún cambio de un solo componente cierra la brecha: hará falta una combinación. La brecha en dólares es el valor originario total por agregar.",
  // csv-import errors
  "No rows recognized. Expected columns like: Component Name, HS Subheading, Tariff Item, Origin Country, USMCA Origin Status, Value.":
    "No se reconoció ninguna fila. Se esperan columnas como: Component Name, HS Subheading, Tariff Item, Origin Country, USMCA Origin Status, Value.",
};

interface RegexRule {
  re: RegExp;
  es: (m: RegExpMatchArray) => string;
}

const ES_REGEX_RULES: RegexRule[] = [
  {
    re: /^(\d+) line item\(s\) are missing an HS code - required for the certificate and for any tariff-shift determination\.$/,
    es: (m) =>
      m[1] +
      " partidas no tienen código HS: es requerido para el certificado y para cualquier determinación de cambio de clasificación.",
  },
];

export function tt(text: string, locale: string): string {
  if (locale !== "es" || !text) return text;
  const exact = ES_RESULT_COPY[text];
  if (exact) return exact;
  for (const rule of ES_REGEX_RULES) {
    const m = text.match(rule.re);
    if (m) return rule.es(m);
  }
  return text;
}