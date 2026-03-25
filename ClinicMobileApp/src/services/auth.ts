import {OtpResponse, VerifyResponse} from '../types/app';

export function normalizePhone(value: string): string {
  return value.replace(/\s+/g, '').trim();
}

export function isValidPhone(value: string): boolean {
  return /^\+?\d{8,15}$/.test(value);
}

export function isValidOtp(value: string): boolean {
  return /^\d{4,6}$/.test(value);
}

export async function requestOtp(baseUrl: string, phoneNumber: string): Promise<OtpResponse> {
  const res = await fetch(`${baseUrl}/auth/send-otp`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({phone_number: phoneNumber}),
  });
  const data = (await res.json()) as OtpResponse | {detail?: string};
  if (!res.ok) {
    const detail = 'detail' in data && data.detail ? data.detail : 'Failed to send OTP';
    throw new Error(detail);
  }
  return data as OtpResponse;
}

export async function verifyOtpRequest(
  baseUrl: string,
  phoneNumber: string,
  otp: string,
  fullName: string,
): Promise<VerifyResponse> {
  const res = await fetch(`${baseUrl}/auth/verify-otp`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      phone_number: phoneNumber,
      otp,
      full_name: fullName,
    }),
  });
  const data = (await res.json()) as VerifyResponse | {detail?: string};
  if (!res.ok) {
    const detail = 'detail' in data && data.detail ? data.detail : 'Failed to verify OTP';
    throw new Error(detail);
  }
  if (!('access_token' in data)) {
    throw new Error('Token missing in verify response');
  }
  return data;
}
