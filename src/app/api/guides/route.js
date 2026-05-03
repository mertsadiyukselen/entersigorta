import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const includeInactive = searchParams.get('all') === '1';

    if (slug) {
      const row = await prisma.guideArticle.findFirst({
        where: { slug, ...(includeInactive ? {} : { isActive: true }) },
      });
      return row ? NextResponse.json(row) : NextResponse.json({ error: 'Bulunamadı' }, { status: 404 });
    }

    const list = await prisma.guideArticle.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }],
    });

    return NextResponse.json(list);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const publishedAt =
      typeof body.publishedAt === 'string' && body.publishedAt
        ? new Date(body.publishedAt)
        : new Date();

    const created = await prisma.guideArticle.create({
      data: {
        slug: body.slug?.trim(),
        title: body.title?.trim(),
        excerpt: body.excerpt?.trim() || null,
        category: body.category?.trim() || 'Genel',
        body: body.body || '',
        publishedAt,
        sortOrder: Number.isFinite(body.sortOrder) ? body.sortOrder : 0,
        isActive: body.isActive !== false,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Makale oluşturulamadı (slug benzersiz olmalı)' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const publishedAt =
      typeof body.publishedAt === 'string' && body.publishedAt
        ? new Date(body.publishedAt)
        : undefined;

    const updated = await prisma.guideArticle.update({
      where: { id: body.id },
      data: {
        slug: body.slug?.trim(),
        title: body.title?.trim(),
        excerpt: body.excerpt?.trim() || null,
        category: body.category?.trim() || 'Genel',
        body: body.body || '',
        ...(publishedAt ? { publishedAt } : {}),
        sortOrder: Number.isFinite(body.sortOrder) ? body.sortOrder : 0,
        isActive: !!body.isActive,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Makale güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'), 10);
    await prisma.guideArticle.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Silinemedi' }, { status: 500 });
  }
}
