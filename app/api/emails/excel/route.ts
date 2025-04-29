import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import ExcelJS from 'exceljs';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get('limit');
  const limit = parseInt(limitParam || '');

  if (isNaN(limit) || limit <= 0) {
    return NextResponse.json({ status: 'error', message: 'Limit phải là số nguyên dương' }, { status: 400 });
  }

  try {
    const db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [results] = await db.execute(
      `SELECT id, email, password, app_password, secret_key, recovery_email FROM gmail ORDER BY id DESC LIMIT ?`,
      [limit]
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Emails');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Email', key: 'email', width: 40 },
      { header: 'Password', key: 'password', width: 25 },
      { header: 'App Password', key: 'app_password', width: 25 },
      { header: '2 FA', key: 'secret_key', width: 40 },
      { header: 'Recovery Email', key: 'recovery_email', width: 40 },
    ];

    (results as any[]).forEach((row) => worksheet.addRow(row));

    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="emails.xlsx"',
      },
    });
  } catch (error) {
    console.error('Lỗi tạo Excel:', error);
    return NextResponse.json({ status: 'error', message: 'Lỗi server' }, { status: 500 });
  }
}
