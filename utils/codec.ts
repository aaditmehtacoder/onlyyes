import { Buffer } from 'buffer';

export type OnlyYesConfig = {
  toName: string;
  fromName: string;
  note?: string;
  gifUrl?: string;
  themeId?: string;
  tricks?: {
    dodgeNo?: boolean;
    jumpscare?: boolean;
    magnetNo?: boolean;
    morphNoToYes?: boolean;
    ghostNo?: boolean;
  };
};

function base64UrlEncode(input: string) {
  const b64 = Buffer.from(input, 'utf8').toString('base64');
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlDecode(input: string) {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(input.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64').toString('utf8');
}

export function encodeConfig(cfg: OnlyYesConfig): string {
  return base64UrlEncode(JSON.stringify(cfg));
}

export function decodeConfig(code: string): OnlyYesConfig | null {
  try {
    const json = base64UrlDecode(code);
    const obj = JSON.parse(json);
    if (!obj || typeof obj !== 'object') return null;
    if (typeof obj.toName !== 'string' || typeof obj.fromName !== 'string') return null;
    return obj as OnlyYesConfig;
  } catch {
    return null;
  }
}
