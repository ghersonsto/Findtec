export { serviceOptions, commercialServices, resolveServiceValue, getServiceOption } from "@/lib/services";

export const company = {
  name: "Findtec Soluciones",
  shortName: "Findtec",
  legalName: "Findtec Bienes y Servicios e Inversiones E.I.R.L.",
  ruc: "20613828606",
  description:
    "Software de gestión, integraciones con IA, digitalización e infraestructura TI para empresas e instituciones en Perú.",
  email: "FindtecSoluciones@gmail.com",
  phone: "+51 906 626 008",
  phoneHref: "tel:+51906626008",
  whatsappNumber: "51906626008",
  address: "Av. Miramar Lte. 1 URB 15058, Lima, Perú",
  shortAddress: "Chorrillos, Perú",
  siteUrl: "https://findtec.pe",
  logo: {
    dark: "/images/logo-dark.png",
    light: "/images/logo-light.png",
    mark: "/images/findtec-mark.png",
  },
};

export function whatsappHref(
  message = "Hola, deseo información sobre los servicios de Findtec Soluciones.",
) {
  return `https://wa.me/${company.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
