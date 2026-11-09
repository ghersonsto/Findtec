import { NextResponse } from "next/server";

import { company, serviceOptions } from "@/lib/company";
import { companyCapabilities } from "@/lib/experience";
import { heroReel } from "@/lib/media";

export async function GET() {
  return NextResponse.json({
    ok: true,
    brand: {
      name: company.name,
      shortName: company.shortName,
      legalName: company.legalName,
      ruc: company.ruc,
      description: company.description,
      logo: company.logo,
    },
    contact: {
      email: company.email,
      phone: company.phone,
      whatsapp: company.whatsappNumber,
      address: company.address,
      city: company.shortAddress,
    },
    services: serviceOptions,
    capabilities: companyCapabilities,
    stack: ["Laravel", "Vue.js", "MySQL", "Docker", "Python", "FastAPI", "Microsoft 365"],
    media: {
      reel: heroReel,
    },
    updatedAt: new Date().toISOString(),
  });
}
