import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const MAX_BYTES = 800 * 1024;
const ALLOWED = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/gif', 'gif'],
  ['image/webp', 'webp'],
]);

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string' || !file.name) {
      return NextResponse.json({ error: 'Dosya yok' }, { status: 400 });
    }

    const type = file.type;
    const ext = ALLOWED.get(type);
    if (!ext) {
      return NextResponse.json(
        { error: 'Sadece JPEG, PNG, GIF veya WebP yüklenebilir' },
        { status: 400 },
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());
    if (buf.length > MAX_BYTES) {
      return NextResponse.json(
        { error: `Dosya en fazla ${MAX_BYTES / 1024} KB olabilir` },
        { status: 400 },
      );
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'partners');
    await mkdir(uploadDir, { recursive: true });

    const safeName = `${Date.now()}-${randomBytes(5).toString('hex')}.${ext}`;
    const diskPath = join(uploadDir, safeName);
    await writeFile(diskPath, buf);

    const url = `/uploads/partners/${safeName}`;
    return NextResponse.json({ ok: true, url });
  } catch {
    return NextResponse.json({ error: 'Yükleme başarısız' }, { status: 500 });
  }
}
