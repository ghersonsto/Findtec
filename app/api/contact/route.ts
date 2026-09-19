import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

import { company, serviceOptions } from "@/lib/company";

const contactSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  empresa: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.string().trim().email().max(160),
  telefono: z.string().trim().max(40).optional().or(z.literal("")),
  servicio: z.string().refine((value) => serviceOptions.some((service) => service.value === value)),
  mensaje: z.string().trim().max(1500).optional().or(z.literal("")),
});

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
          message: "El correo del sitio no está configurado.",
        },
        { status: 503 },
      );
    }

    const selectedService =
      serviceOptions.find((service) => service.value === data.servicio)?.label || data.servicio;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${company.name}" <${process.env.SMTP_USER}>`,
      replyTo: data.email,
      to: process.env.CONTACT_TO,
      subject: `Nuevo contacto FindTec: ${selectedService}`,
      text: `
Nombre: ${data.nombre}
Empresa: ${data.empresa || "No especificada"}
Correo: ${data.email}
Teléfono: ${data.telefono || "No especificado"}
Servicio: ${selectedService}

Mensaje:
${data.mensaje || "Sin mensaje adicional"}
      `.trim(),
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Los datos enviados no son válidos.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "No se pudo enviar el mensaje.",
      },
      { status: 500 },
    );
  }
}
