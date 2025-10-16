import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let f = req.nextUrl.searchParams.get("f");

  if (f === "traer categorias") {
    let data = await db.$queryRawUnsafe(`SELECT * FROM cari.categorias`);

    return NextResponse.json(data);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const user = await db.$queryRawUnsafe(
    `
        INSERT INTO cari.categorias
        (
        
        categoria, 
            descripcion
        )
        VALUES
        (  
          '${body.categoria}',
          '${body.descripcion}'
        )
    `
  );

  await db.$disconnect();

  return NextResponse.json(user);
}

export async function DELETE(req: NextRequest) {
  console.log(req.nextUrl.searchParams);
  let f = req.nextUrl.searchParams.get("f");
  let id = req.nextUrl.searchParams.get("id");

  if (f === "eliminar categorias") {
    let data = await db.$queryRawUnsafe(
      `DELETE FROM cari.categorias WHERE idcategoria = ${id}`
    );

    return NextResponse.json(data);
  }
}
