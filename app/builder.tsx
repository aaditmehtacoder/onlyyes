import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { Link, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { THEMES } from '../constants/themes';
import { encodeConfig } from '../utils/codec';
import ValentineCard from '../components/ValentineCard';

const DEFAULT_GIF = 'https://media.giphy.com/media/NoPNkgzHD8HSK6Nr5l/giphy.gif';

function Label({ children }: { children: React.ReactNode }) {
  return <Text style={{ color: 'rgba(255,255,255,0.94)', fontWeight: '900', fontSize: 13, marginBottom: 8, letterSpacing: 0.2 }}>{children}</Text>;
}

export default function Builder() {
  const router = useRouter();
  const [toName, setToName] = useState('Jane');
  const [fromName, setFromName] = useState('Your secret admirer');
  const [note, setNote] = useState('I made this just for you. Be my Valentine?');
  const [gifUrl, setGifUrl] = useState(DEFAULT_GIF);
  const [themeId, setThemeId] = useState((THEMES.find(t=>t.id==='aurora') ?? THEMES[0]).id);

  const [tricks, setTricks] = useState({
    dodgeNo: true,
    jumpscare: false,
    magnetNo: false,
    morphNoToYes: false,
    ghostNo: false
  });

  const theme = useMemo(() => THEMES.find(t => t.id === themeId) ?? THEMES[0], [themeId]);

  const code = useMemo(() => {
    return encodeConfig({ toName, fromName, note, gifUrl, themeId, tricks });
  }, [toName, fromName, note, gifUrl, themeId, tricks]);

  const link = useMemo(() => {
    // Works for local dev. When deployed, replace origin with your domain.
    const base = Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.origin : 'https://onlyyes.love';
    return `${base}/v/${code}`;
  }, [code]);

  const copy = async () => {
    await Clipboard.setStringAsync(link);
  };

  return (
    <LinearGradient colors={theme.bg} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 18, paddingTop: 30, paddingBottom: 40, gap: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text style={{ color: 'white', fontSize: 24, fontWeight: '900' }}>Builder</Text>
          <Link href="/" asChild>
            <Pressable><Text style={{ color: 'rgba(255,255,255,0.9)', fontWeight: '800' }}>Home</Text></Pressable>
          </Link>
        </View>

        <View style={{ padding: 14, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.22)' }}>
          <Label>To (their name)</Label>
          <TextInput value={toName} onChangeText={setToName} placeholder="Jane" placeholderTextColor="rgba(255,255,255,0.6)" style={{ color: 'white', fontSize: 16, fontWeight: '800', paddingVertical: 12, paddingHorizontal: 14, backgroundColor: 'rgba(0,0,0,0.28)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' }} />

          <Label>From (your name)</Label>
          <TextInput value={fromName} onChangeText={setFromName} placeholder="Your name" placeholderTextColor="rgba(255,255,255,0.6)" style={{ color: 'white', fontSize: 16, fontWeight: '800', paddingVertical: 12, paddingHorizontal: 14, backgroundColor: 'rgba(0,0,0,0.28)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' }} />

          <Label>Custom note</Label>
          <TextInput value={note} onChangeText={setNote} multiline placeholder="Write something cute" placeholderTextColor="rgba(255,255,255,0.6)" style={{ color: 'white', fontSize: 15, lineHeight: 20, fontWeight: '700', paddingVertical: 10 }} />

          <Label>GIF URL</Label>
          <TextInput value={gifUrl} onChangeText={setGifUrl} placeholder={DEFAULT_GIF} placeholderTextColor="rgba(255,255,255,0.6)" style={{ color: 'white', fontSize: 13, fontWeight: '700', paddingVertical: 10 }} />
        </View>

        <View style={{ padding: 14, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.22)', gap: 10 }}>
          <Label>Theme</Label>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {THEMES.map(t => (
              <Pressable
                key={t.id}
                onPress={() => setThemeId(t.id)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 14,
                  backgroundColor: themeId === t.id ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.18)'
                }}
              >
                <Text style={{ color: themeId === t.id ? '#111827' : 'white', fontWeight: '900', fontSize: 12 }}>{t.name}</Text>
              </Pressable>
            ))}
          </View>

          <Label>Tricks</Label>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {Object.entries(tricks).map(([k, v]) => (
              <Pressable
                key={k}
                onPress={() =>
  setTricks(prev => {
    const key = k as keyof typeof prev;
    const nextValue = true; // toggle clicked one

    // turn everything off first
    const next = Object.fromEntries(
      Object.keys(prev).map((kk) => [kk, false])
    ) as typeof prev;

    // if toggling on, turn only this one on
    // if toggling off, leave all false
    next[key] = nextValue;

    return next;
  })
}

                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 14,
                  backgroundColor: v ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.18)'
                }}
              >
                <Text style={{ color: v ? '#111827' : 'white', fontWeight: '900', fontSize: 12 }}>{k}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ padding: 14, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.22)', gap: 12 }}>
          <Label>Your shareable link</Label>
          <Text selectable style={{ color: 'white', fontWeight: '800', fontSize: 12, backgroundColor: 'rgba(0,0,0,0.28)', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)' }}>
            {link}
          </Text>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable onPress={copy} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 16, paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ color: '#111827', fontWeight: '900' }}>Copy link</Text>
            </Pressable>
            <Pressable onPress={() => router.push(`/v/${code}`)} style={{ flex: 1, backgroundColor: 'rgba(17,24,39,0.55)', borderRadius: 16, paddingVertical: 12, alignItems: 'center' }}>
              <Text style={{ color: 'white', fontWeight: '900' }}>Preview</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ padding: 14, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.18)' }}>
          <Text style={{ color: 'rgba(255,255,255,0.92)', fontWeight: '900', marginBottom: 10 }}>Live preview</Text>
          <View style={{ height: 520, borderRadius: 18, overflow: 'hidden' }}>
            <ValentineCard
              config={{ toName, fromName, note, gifUrl, themeId, tricks }}
              forceEmbedded
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
