import { decodeConfig, encodeConfig } from '../utils/codec';

test('encode/decode roundtrip', () => {
  const cfg = {
    toName: 'Jane',
    fromName: 'Sam',
    note: 'hi',
    gifUrl: 'https://example.com/g.gif',
    themeId: 'cotton-candy',
    tricks: { dodgeNo: true, jumpscare: true }
  };
  const code = encodeConfig(cfg);
  const back = decodeConfig(code);
  expect(back?.toName).toBe(cfg.toName);
  expect(back?.fromName).toBe(cfg.fromName);
  expect(back?.note).toBe(cfg.note);
});
