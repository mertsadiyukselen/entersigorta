import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, phone, email, subject, message } = await req.json();

    // 1. Veritabanına kaydet
    const application = await prisma.application.create({
      data: { name, phone, email, subject, message }
    });

    // 2. SMTP ayarlarını çek ve email gönder (Eğer ayarlar girilmişse)
    const hostSetting = await prisma.setting.findUnique({ where: { key: 'smtp_host' } });
    const portSetting = await prisma.setting.findUnique({ where: { key: 'smtp_port' } });
    const userSetting = await prisma.setting.findUnique({ where: { key: 'smtp_user' } });
    const passSetting = await prisma.setting.findUnique({ where: { key: 'smtp_pass' } });

    if (hostSetting?.value && userSetting?.value && passSetting?.value) {
      let transporter = nodemailer.createTransport({
        host: hostSetting.value,
        port: parseInt(portSetting?.value || '587'),
        secure: parseInt(portSetting?.value || '587') === 465,
        auth: {
          user: userSetting.value,
          pass: passSetting.value,
        },
      });

      await transporter.sendMail({
        from: `"Enter Sigorta Başvuru" <${userSetting.value}>`,
        to: userSetting.value, // Şirket kendi kendine veya belirlediği mail adresine yollar
        subject: `Yeni Başvuru: ${subject} - ${name}`,
        text: `İsim: ${name}\nTelefon: ${phone}\nE-posta: ${email}\nKonu: ${subject}\n\nMesaj:\n${message}`,
        html: `<h3>Yeni Başvuru Alındı</h3>
               <p><b>İsim:</b> ${name}</p>
               <p><b>Telefon:</b> ${phone}</p>
               <p><b>E-posta:</b> ${email}</p>
               <p><b>Konu:</b> ${subject}</p>
               <p><b>Mesaj:</b><br/>${message}</p>`,
      });
    }

    return NextResponse.json({ success: true, data: application });
  } catch (error) {
    console.error("Contact Form Errror:", error);
    return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 500 });
  }
}
