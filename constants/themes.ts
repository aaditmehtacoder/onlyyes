export type ThemePreset = {
  id: string;
  name: string;
  bg: [string, string];
  card: string;
  accent: string;
  yes: string;
  no: string;
  radius: number;
};

export const THEMES: ThemePreset[] = [
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    bg: ['#ff4fa3', '#3dd6ff'],
    card: '#ffffff',
    accent: '#ff2d7a',
    yes: '#ff2d7a',
    no: '#edf0f7',
    radius: 24
  },
  {
    id: 'sunset',
    name: 'Sunset',
    bg: ['#ffb36b', '#ff4d6d'],
    card: 'rgba(255,255,255,0.92)',
    accent: '#2b2d42',
    yes: '#2b2d42',
    no: 'rgba(255,255,255,0.72)',
    radius: 28
  },
  {
    id: 'aurora',
    name: 'Aurora',
    bg: ['#2ef9a0', '#5b8cff'],
    card: 'rgba(10,10,20,0.78)',
    accent: '#ffffff',
    yes: '#ff2d7a',
    no: 'rgba(255,255,255,0.20)',
    radius: 30
  }
];
