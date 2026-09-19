export const company = {
  name: "FindTec Soluciones",
  legalName: "FINDTEC BIENES Y SERVICIOS E INVERSIONES E.I.R.L.",
  description:
    "Soluciones tecnológicas para empresas e instituciones: hardware, soporte TI, redes, Microsoft 365, automatización, desarrollo web, datos e inteligencia artificial aplicada.",
  email: "FindtecSoluciones@gmail.com",
  phone: "+51 906 626 008",
  phoneHref: "tel:+51906626008",
  whatsappNumber: "51906626008",
  address: "Av. Miramar Lte. 1 URB 15058, Lima, Perú",
  shortAddress: "Chorrillos, Lima, Perú",
  siteUrl: "https://findtec.pe",
};

export const serviceOptions = [
  { value: "hardware", label: "Hardware empresarial" },
  { value: "cloud", label: "Cloud y Microsoft 365" },
  { value: "redes", label: "Redes e infraestructura" },
  { value: "seguridad", label: "Seguridad y cumplimiento TI" },
  { value: "soporte", label: "Soporte técnico" },
  { value: "mantenimiento", label: "Mantenimiento de equipos" },
  { value: "automatizacion", label: "Power Automate / Power Apps" },
  { value: "web", label: "Desarrollo web" },
  { value: "datos", label: "Análisis de datos" },
  { value: "ia", label: "IA, Machine Learning y Deep Learning" },
  { value: "documentacion", label: "Documentación y capacitación TI" },
  { value: "consultoria", label: "Consultoría tecnológica" },
  { value: "otro", label: "Otro" },
];

export function whatsappHref(message = "Hola, deseo información sobre los servicios de FindTec Soluciones.") {
  return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
