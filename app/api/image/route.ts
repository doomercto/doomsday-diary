import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  const requestFormData = await request.formData();
  for (const key of [...requestFormData.keys()]) {
    if (key !== 'image') {
      requestFormData.delete(key);
    }
  }
  const result = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_KEY}`,
    {
      method: 'POST',
      body: requestFormData,
    }
  );
  const resultJson = await result.json().catch(() => ({}));
  if (!resultJson?.data?.url) {
    console.warn(resultJson?.error?.message ?? resultJson?.error ?? 'error');
    return NextResponse.json(
      { error: resultJson?.error?.message ?? resultJson?.error },
      { status: 400 }
    );
  }
  return NextResponse.json({
    url: resultJson.data.url,
  });
};
