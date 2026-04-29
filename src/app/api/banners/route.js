import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('all') === '1';

    const banners = await prisma.banner.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });

    return NextResponse.json(banners);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const created = await prisma.banner.create({
      data: {
        title: body.title,
        subtitle: body.subtitle || null,
        description: body.description || null,
        imageUrl: body.imageUrl,
        primaryCtaText: body.primaryCtaText || null,
        primaryCtaHref: body.primaryCtaHref || null,
        secondaryCtaText: body.secondaryCtaText || null,
        secondaryCtaHref: body.secondaryCtaHref || null,
        sortOrder: Number.isFinite(body.sortOrder) ? body.sortOrder : 0,
        isActive: body.isActive !== false,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Banner oluşturulamadı' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const updated = await prisma.banner.update({
      where: { id: body.id },
      data: {
        title: body.title,
        subtitle: body.subtitle || null,
        description: body.description || null,
        imageUrl: body.imageUrl,
        primaryCtaText: body.primaryCtaText || null,
        primaryCtaHref: body.primaryCtaHref || null,
        secondaryCtaText: body.secondaryCtaText || null,
        secondaryCtaHref: body.secondaryCtaHref || null,
        sortOrder: Number.isFinite(body.sortOrder) ? body.sortOrder : 0,
        isActive: !!body.isActive,
      },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Banner güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Banner silinemedi' }, { status: 500 });
  }
}

