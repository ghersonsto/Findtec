import { company } from "@/lib/company";

export type LegalSection = {
  title: string;
  body: string;
};

export const termsSections: LegalSection[] = [
  {
    title: "Aceptación de términos",
    body: `Al acceder y utilizar el sitio web de ${company.name}, usted acepta estos Términos y Condiciones en su totalidad. Si no está de acuerdo con alguno de ellos, le pedimos abstenerse de usar nuestros servicios digitales y canales de contacto.`,
  },
  {
    title: "Descripción de servicios",
    body: `${company.name} ofrece desarrollo de sitios web corporativos, tiendas online, aplicaciones web a medida, integraciones con IA, cloud y seguridad TI, así como mantenimiento y soporte técnico para empresas e instituciones en Perú. El alcance exacto de cada proyecto se define en la propuesta comercial correspondiente.`,
  },
  {
    title: "Cotizaciones y pagos",
    body: `Las cotizaciones tienen carácter referencial hasta su aceptación formal. Los pagos se realizan según el cronograma acordado en la propuesta (adelantos, hitos o cierre). Los importes abonados por etapas ya ejecutadas no son reembolsables, salvo pacto escrito en contrario.`,
  },
  {
    title: "Propiedad intelectual",
    body: `Tras el pago total del proyecto, el cliente es propietario del código, diseños y entregables específicos desarrollados para su operación. ${company.name} se reserva el derecho de mencionar el proyecto en su portafolio y materiales de marketing, salvo acuerdo de confidencialidad que lo limite.`,
  },
  {
    title: "Responsabilidades del cliente",
    body: `El cliente es responsable de proporcionar información veraz, accesos necesarios y materiales (textos, logos, imágenes, credenciales) sobre los que tenga derechos de uso. Retrasos en la entrega de insumos pueden afectar plazos acordados.`,
  },
  {
    title: "Plazos de entrega",
    body: `Los plazos se establecen en la propuesta técnica según la complejidad del alcance. Proyectos básicos pueden resolverse en plazos cortos; sistemas a medida, integraciones o infraestructura requieren cronogramas documentados por hitos.`,
  },
  {
    title: "Revisiones y cambios",
    body: `Cada paquete incluye un número razonable de revisiones dentro del alcance cerrado. Solicitudes adicionales o cambios de alcance posteriores a la aprobación pueden generar costos y plazos extras, comunicados previamente por escrito.`,
  },
  {
    title: "Limitación de responsabilidad",
    body: `${company.name} no será responsable por daños indirectos, lucros cesantes o perjuicios derivados del uso indebido de los sistemas entregados, ni por interrupciones ajenas a nuestro control (terceros, hosting del cliente, fuerza mayor).`,
  },
  {
    title: "Terminación",
    body: `Cualquiera de las partes puede dar por terminada la relación comercial con aviso escrito, conforme a lo estipulado en la propuesta o contrato. Las obligaciones de pago por trabajo ya ejecutado permanecen vigentes.`,
  },
  {
    title: "Información de contacto",
    body: `Para consultas sobre estos términos: ${company.email} · ${company.phone} · ${company.shortAddress}. Razón social: ${company.legalName} (RUC ${company.ruc}).`,
  },
];

export const privacySections: LegalSection[] = [
  {
    title: "Introducción",
    body: `${company.name} respeta su privacidad. Esta Política describe qué datos personales podemos recopilar a través del sitio web, formularios de contacto, WhatsApp y canales relacionados, y cómo los tratamos.`,
  },
  {
    title: "Datos que recopilamos",
    body: `Podemos recopilar nombre, correo electrónico, teléfono o WhatsApp, empresa, mensaje y servicio de interés cuando usted los envía voluntariamente. También datos técnicos básicos de navegación (por ejemplo, tipo de dispositivo o páginas visitadas) con fines de mejora del sitio.`,
  },
  {
    title: "Uso de la información",
    body: `Utilizamos sus datos para responder solicitudes de cotización o soporte, elaborar propuestas, dar seguimiento comercial y mejorar la experiencia del sitio. No vendemos su información personal a terceros.`,
  },
  {
    title: "Base del tratamiento",
    body: `Tratamos sus datos con base en su consentimiento al completar formularios o contactarnos, y en el interés legítimo de atender consultas comerciales relacionadas con nuestros servicios tecnológicos.`,
  },
  {
    title: "Compartición con terceros",
    body: `Podemos compartir datos únicamente con proveedores necesarios para operar (por ejemplo, hosting o herramientas de correo), bajo obligaciones de confidencialidad, o cuando la ley lo exija.`,
  },
  {
    title: "Conservación",
    body: `Conservamos la información el tiempo necesario para gestionar la relación comercial, cumplir obligaciones legales o resolver consultas. Puede solicitar la eliminación de sus datos cuando corresponda.`,
  },
  {
    title: "Seguridad",
    body: `Aplicamos medidas técnicas y organizativas razonables para proteger la información frente a accesos no autorizados. Ningún medio de transmisión por Internet es 100 % seguro; le pedimos no enviar datos sensibles innecesarios por formularios públicos.`,
  },
  {
    title: "Derechos del titular",
    body: `Usted puede solicitar acceso, actualización o eliminación de sus datos personales escribiéndonos a ${company.email}. Atenderemos su solicitud en plazos razonables conforme a la normativa aplicable en Perú.`,
  },
  {
    title: "Cookies y analítica",
    body: `El sitio puede usar cookies o tecnologías similares para recordar preferencias (por ejemplo, tema claro/oscuro) y entender el uso agregado del sitio. Puede configurar su navegador para limitar cookies.`,
  },
  {
    title: "Contacto",
    body: `Responsable del tratamiento: ${company.legalName} (RUC ${company.ruc}). Contacto: ${company.email} · ${company.phone} · ${company.address}.`,
  },
];
