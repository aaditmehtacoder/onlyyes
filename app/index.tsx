import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { Platform, Pressable, Text, View } from 'react-native';
import ValentineCard from '../components/ValentineCard';
import { THEMES } from '../constants/themes';

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.22)' }}>
      <Text style={{ color: 'white', fontWeight: '700', fontSize: 12 }}>{children}</Text>
    </View>
  );
}

export default function Landing() {
  const theme = THEMES[0];
  return (
    <LinearGradient colors={theme.bg} style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 36, paddingBottom: 24, justifyContent: 'space-between' }}>
        <View style={{ gap: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontWeight: '900', fontSize: 22, letterSpacing: 0.3 }}>OnlyYes.love</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pill>Free</Pill>
              <Pill>{Platform.OS === 'web' ? 'Web + Mobile' : 'Mobile'}</Pill>
            </View>
          </View>

          <Text style={{ color: 'white', fontWeight: '900', fontSize: 42, lineHeight: 46 }}>
            The valentine link they can’t say “no” to.
          </Text>

          <Text style={{ color: 'rgba(255,255,255,0.92)', fontSize: 16, lineHeight: 22 }}>
            Build a cute, custom “Will you be my Valentine?” page with playful tricks, a GIF, and a shareable link. 
            Your crush gets one job: tap <Text style={{ fontWeight: '900' }}>YES</Text>.
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
            <Pill>Dodging NO button</Pill>
            <Pill>Jumpscare modal</Pill>
            <Pill>Magnet mode</Pill>
            <Pill>Confetti when YES</Pill>
            <Pill>Shareable link</Pill>
          </View>
        </View>

        
<View style={{ alignItems: 'center', marginTop: 18 }}>
  <View style={{ width: '100%', maxWidth: 820 }}>
    <View style={{ borderRadius: 28, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.22)', padding: 14 }}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: '100%', maxWidth: 560 }}>
          <ValentineCard
            forceEmbedded
            config={{
              toName: 'Jane',
              fromName: 'Your secret admirer',
              note: 'I made this just for you. Be my Valentine?',
              gifUrl: 'https://media.giphy.com/media/NoPNkgzHD8HSK6Nr5l/giphy.gif',
              themeId: theme.id,
              tricks: { dodgeNo: true, jumpscare: true, magnetNo: false, morphNoToYes: false, ghostNo: false }
            }}
          />
        </View>
      </View>
      <Text style={{ marginTop: 10, textAlign: 'center', color: 'rgba(255,255,255,0.92)', fontSize: 13 }}>
        Try it: the “NO” button dodges your cursor. Build yours in seconds.
      </Text>
    </View>
  </View>
</View>

<View style={{ gap: 12 }}>
          <Link href="/builder" asChild>
            <Pressable
              style={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                borderRadius: 18,
                paddingVertical: 16,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#111827', fontWeight: '900', fontSize: 16 }}>Create your OnlyYes link</Text>
            </Pressable>
          </Link>

          <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, textAlign: 'center' }}>
            Pro tip: customize the theme + tricks in the builder.
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
