import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const settingsRecords = await prisma.setting.findMany();
    const settings = settingsRecords.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({});
  }
}
