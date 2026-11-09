import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

import { company } from "@/lib/company";
import { getServiceOption, resolveServiceValue, serviceOptions } from "@/lib/services";

const contactSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  empresa: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email().max(160),
  telefono: z.string().trim().max(40).optional().or(z.literal("")),
  servicio: z
    .string()
    .transform((value) => resolveServiceValue(value) || value)
    .refine((value) => serviceOptions.some((service) => service.value === value), {
      message: "Selecciona un servicio válido",
    }),
  mensaje: z.string().trim().max(1500).optional().or(z.literal("")),
  origen: z.enum(["formulario", "chatbot"]).optional().default("formulario"),
});

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const requiredEnv = [
      process.env.SMTP_HOST,
      process.env.SMTP_PORT,
      process.env.SMTP_USER,
      process.env.SMTP_PASS,
      process.env.CONTACT_TO,
    ];

    if (requiredEnv.some((value) => !value)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "El correo del sitio aún no está configurado. Escríbenos por WhatsApp y te atendemos al instante.",
          fallback: "whatsapp",
        },
        { status: 503 },
      );
    }

    const selectedService = getServiceOption(data.servicio)?.label || data.servicio;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const safe = {
      nombre: escapeHtml(data.nombre),
      empresa: escapeHtml(data.empresa || "No especificada"),
      email: escapeHtml(data.email),
      telefono: escapeHtml(data.telefono || "No especificado"),
      servicio: escapeHtml(selectedService),
      mensaje: escapeHtml(data.mensaje || "Sin mensaje adicional"),
      origen: data.origen === "chatbot" ? "Chatbot web" : "Formulario web",
    };

    const textBody = `
Nuevo contacto Findtec Soluciones (${safe.origen})

Nombre: ${data.nombre}
Empresa: ${data.empresa || "No especificada"}
Correo: ${data.email}
Teléfono: ${data.telefono || "No especificado"}
Servicio: ${selectedService}

Mensaje:
${data.mensaje || "Sin mensaje adicional"}
    `.trim();

    const htmlBody = `
      <div style="font-family:Segoe UI,Arial,sans-serif;background:#0f172a;color:#e2e8f0;padding:24px;">
        <div style="max-width:560px;margin:0 auto;background:#1e293b;border-radius:16px;overflow:hidden;border:1px solid #334155;">
          <div style="background:linear-gradient(135deg,#3b82f6,#2563eb);padding:20px 24px;">
            <h1 style="margin:0;font-size:20px;color:#fff;">Nuevo contacto — Findtec Soluciones</h1>
            <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,.85);">${safe.origen}</p>
          </div>
          <div style="padding:24px;">
            <p style="margin:0 0 12px;"><strong style="color:#94a3b8;">Nombre:</strong> ${safe.nombre}</p>
            <p style="margin:0 0 12px;"><strong style="color:#94a3b8;">Empresa:</strong> ${safe.empresa}</p>
            <p style="margin:0 0 12px;"><strong style="color:#94a3b8;">Correo:</strong> ${safe.email}</p>
            <p style="margin:0 0 12px;"><strong style="color:#94a3b8;">Teléfono:</strong> ${safe.telefono}</p>
            <p style="margin:0 0 16px;"><strong style="color:#94a3b8;">Servicio:</strong> ${safe.servicio}</p>
            <div style="background:#0f172a;border-radius:12px;padding:16px;border:1px solid #334155;">
              <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:.06em;">Mensaje</p>
              <p style="margin:0;line-height:1.55;white-space:pre-wrap;">${safe.mensaje}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${company.name}" <${process.env.SMTP_USER}>`,
      replyTo: data.email,
      to: process.env.CONTACT_TO,
      subject: `[Findtec Soluciones] ${selectedService} — ${data.nombre}`,
      text: textBody,
      html: htmlBody,
    });

    return NextResponse.json({
      success: true,
      message: "Recibimos tu mensaje. Te contactaremos pronto.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.issues[0]?.message || "Revisa los datos del formulario.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "No se pudo enviar el mensaje. Intenta por WhatsApp.",
        fallback: "whatsapp",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  const configured = Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.CONTACT_TO,
  );

  return NextResponse.json({
    ok: true,
    service: "findtec-contact",
    mailConfigured: configured,
  });
}
