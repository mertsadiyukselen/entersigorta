import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: List active job listings (public)
export async function GET() {
  try {
    const jobs = await prisma.jobListing.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(jobs);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

// POST: Create a new job listing (admin)
export async function POST(request) {
  try {
    const body = await request.json();
    const job = await prisma.jobListing.create({
      data: {
        title: body.title,
        location: body.location,
        type: body.type,
        department: body.department,
        description: body.description,
        requirements: body.requirements,
        isActive: body.isActive !== false,
      },
    });
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'İlan oluşturulamadı' }, { status: 500 });
  }
}

// PUT: Update a job listing
export async function PUT(request) {
  try {
    const body = await request.json();
    const job = await prisma.jobListing.update({
      where: { id: body.id },
      data: {
        title: body.title,
        location: body.location,
        type: body.type,
        department: body.department,
        description: body.description,
        requirements: body.requirements,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: 'İlan güncellenemedi' }, { status: 500 });
  }
}

// DELETE: Remove a job listing
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id'));
    await prisma.jobListing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'İlan silinemedi' }, { status: 500 });
  }
}
