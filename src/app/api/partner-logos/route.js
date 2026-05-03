import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('all') === '1';

    const logos = await prisma.partnerLogo.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });

    return NextResponse.json(logos);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const created = await prisma.partnerLogo.create({
      data: {
        name: body.name,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl || null,
        sortOrder: Number.isFinite(body.sortOrder) ? body.sortOrder : 0,
        isActive: body.isActive !== false,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Logo oluşturulamadı' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const updated = await prisma.partnerLogo.update({
      where: { id: body.id },
      data: {
        name: body.name,
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl || null,
        sortOrder: Number.isFinite(body.sortOrder) ? body.sortOrder : 0,
        isActive: !!body.isActive,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Logo güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    await prisma.partnerLogo.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Logo silinemedi' }, { status: 500 });
  }
}

