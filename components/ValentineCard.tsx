import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Modal, Platform, Pressable, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import { THEMES } from '../constants/themes';
import type { OnlyYesConfig } from '../utils/codec';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  config: OnlyYesConfig;
  forceEmbedded?: boolean;
};

function clamp(n: number, min: number, max: number) {
  'worklet';
  return Math.max(min, Math.min(max, n));
}

export default function ValentineCard({ config, forceEmbedded }: Props) {
  const theme = useMemo(() => THEMES.find(t => t.id === (config.themeId ?? '')) ?? THEMES[0], [config.themeId]);

  const isDarkCard = theme.id === 'aurora' || String(theme.card).includes('0.78');
  const textPrimary = isDarkCard ? 'rgba(255,255,255,0.96)' : '#111827';
  const textSecondary = isDarkCard ? 'rgba(255,255,255,0.84)' : 'rgba(17,24,39,0.75)';
  const softBorder = isDarkCard ? 'rgba(255,255,255,0.16)' : 'rgba(17,24,39,0.10)';


  const tricks = config.tricks ?? {};
  const dodgeNo = tricks.dodgeNo ?? true;
  const jumpscare = tricks.jumpscare ?? true;
  const magnetNo = tricks.magnetNo ?? true;
  const morphNoToYes = tricks.morphNoToYes ?? true;
  const ghostNo = tricks.ghostNo ?? true;

  const [stage, setStage] = useState<'ask' | 'yay'>('ask');
  const [noCount, setNoCount] = useState(0);
  const [showJumpscare, setShowJumpscare] = useState(false);

  const containerW = useRef(0);
  const containerH = useRef(0);

  const noX = useSharedValue(0);
  const noY = useSharedValue(0);
  const noScale = useSharedValue(1);
  const noOpacity = useSharedValue(1);

  const yesScale = useSharedValue(1);
  const yesPulse = useSharedValue(0);

  const [yesBox, setYesBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [noBox, setNoBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const [noDisabled, setNoDisabled] = useState(false);

  const gifUrl = config.gifUrl?.trim() || 'https://media.giphy.com/media/NoPNkgzHD8HSK6Nr5l/giphy.gif';

  const cardMaxW = 520;

  useEffect(() => {
    // initial placement: keep NO on the right side a bit
    noX.value = withTiming(90, { duration: 450, easing: Easing.out(Easing.cubic) });
    noY.value = withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) });
  }, []);

  // MAGNET_TICK: gently pulls NO toward YES (web + native) while asking
  useEffect(() => {
    if (!magnetNo || stage !== 'ask' || noDisabled) return;
    if (!yesBox || !noBox) return;
    const id = setInterval(() => {
      const dx = (yesBox.x + yesBox.w / 2) - (noBox.x + noBox.w / 2);
      const dy = (yesBox.y + yesBox.h / 2) - (noBox.y + noBox.h / 2);
      noX.value = withSpring(clamp(dx, -170, 170), { damping: 15, stiffness: 80 });
      noY.value = withSpring(clamp(dy + 28, -120, 120), { damping: 15, stiffness: 80 });
    }, 700);
    return () => clearInterval(id);
  }, [magnetNo, stage, noDisabled, yesBox, noBox]);

  const moveNoRandom = () => {
    const w = containerW.current;
    const h = containerH.current;
    if (!w || !h) return;

    // safe padding so it stays inside the card
    const padX = 120;
    const padY = 80;

    const nx = (Math.random() * 2 - 1) * clamp(w / 3, 120, 190);
    const ny = (Math.random() * 2 - 1) * clamp(h / 6, 50, 120);

    noX.value = withSpring(clamp(nx, -w / 2 + padX, w / 2 - padX), { damping: 14, stiffness: 140 });
    noY.value = withSpring(clamp(ny, -h / 2 + padY, h / 2 - padY), { damping: 14, stiffness: 140 });

    noScale.value = withSpring(0.96);
    yesScale.value = withSpring(clamp(yesScale.value + 0.06, 1, 1.6));
  };

  const maybeDodge = (x: number, y: number) => {
    if (!dodgeNo || stage !== 'ask' || noDisabled) return;
    if (!noBox) return;

    // x,y are relative to container (top-left)
    const cx = noBox.x + noBox.w / 2;
    const cy = noBox.y + noBox.h / 2;
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 110) {
      // run away + make YES grow a little each time
      moveNoRandom();
      yesScale.value = withSpring(clamp(yesScale.value + 0.10, 1, 2.0), { damping: 12, stiffness: 120 });
      noScale.value = withSpring(0.92, { damping: 14, stiffness: 160 });
      if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
    }
  };

  const onNoPress = () => {
    if (noDisabled || stage !== 'ask') return;

    const next = noCount + 1;
    setNoCount(next);

    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});

    // Trick: ghost NO after a couple attempts
    if (ghostNo && next >= 2) {
      noOpacity.value = withTiming(0.15, { duration: 220 });
      setNoDisabled(true);
      // make YES huge so it "wins"
      yesScale.value = withSpring(1.8, { damping: 12, stiffness: 110 });
    }

    // Trick: first NO triggers a jumpscare modal
    if (jumpscare && next === 1) {
      setShowJumpscare(true);
      yesPulse.value = withTiming(1, { duration: 240 });
      yesPulse.value = withTiming(0, { duration: 240 });
      return;
    }

    // Trick: magnet NO towards YES (to encourage mis-tap)
    if (magnetNo && yesBox && next <= 2) {
      const targetX = (yesBox.x + yesBox.w / 2) - (noBox ? (noBox.x + noBox.w / 2) : 0);
      const targetY = (yesBox.y + yesBox.h / 2) - (noBox ? (noBox.y + noBox.h / 2) : 0);
      noX.value = withSpring(clamp(targetX, -160, 160), { damping: 13, stiffness: 120 });
      noY.value = withSpring(clamp(targetY + 30, -110, 110), { damping: 13, stiffness: 120 });
      noScale.value = withSpring(0.9);
      yesScale.value = withSpring(clamp(yesScale.value + 0.08, 1, 1.8));
    } else {
      moveNoRandom();
    }
  };

  const onYesPress = () => {
    if (stage !== 'ask') return;
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setStage('yay');
  };

  const yesAnimated = useAnimatedStyle(() => {
    const pulse = 1 + yesPulse.value * 0.06;
    return {
      transform: [{ scale: withSpring(yesScale.value * pulse) }]
    };
  });

  const noAnimated = useAnimatedStyle(() => {
    return {
      opacity: noOpacity.value,
      transform: [{ translateX: noX.value }, { translateY: noY.value }, { scale: noScale.value }]
    };
  });

  const noLabel = useMemo(() => {
    if (morphNoToYes && noCount >= 3) return 'Yes';
    return 'No';
  }, [morphNoToYes, noCount]);

  const onNoPressEffective = () => {
    if (morphNoToYes && noCount >= 3) return onYesPress();
    return onNoPress();
  };

  return (
    <LinearGradient colors={theme.bg} style={{ flex: 1, padding: 18, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          width: '100%',
          maxWidth: cardMaxW,
          borderRadius: theme.radius,
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: softBorder,
          padding: 18,
          shadowColor: '#000',
          shadowOpacity: 0.18,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 12 },
          elevation: 6,
          overflow: 'hidden'
        }}
        onLayout={(e) => {
          containerW.current = e.nativeEvent.layout.width;
          containerH.current = e.nativeEvent.layout.height;
        }}
        // works on web + native to detect proximity
        onStartShouldSetResponder={() => true}
        onResponderMove={(e) => {
          const { locationX, locationY } = e.nativeEvent;
          maybeDodge(locationX, locationY);
        }}
        // @ts-ignore - RN Web
        onMouseMove={(e) => {
          const ne: any = (e as any).nativeEvent ?? e;
          const x = ne.locationX ?? ne.offsetX ?? ne.layerX;
          const y = ne.locationY ?? ne.offsetY ?? ne.layerY;
          if (typeof x === 'number' && typeof y === 'number') maybeDodge(x, y);
        }}
        // @ts-ignore - RN Web
        onPointerMove={(e) => {
          const ne: any = (e as any).nativeEvent ?? e;
          const x = ne.locationX ?? ne.offsetX ?? ne.layerX;
          const y = ne.locationY ?? ne.offsetY ?? ne.layerY;
          if (typeof x === 'number' && typeof y === 'number') maybeDodge(x, y);
        }}
      >
        <View style={{ alignItems: 'center', gap: 10 }}>
          <View style={{ width: 74, height: 74, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.06)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 34 }}>😺</Text>
            <View style={{ position: 'absolute', right: 6, top: 8 }}>
              <Text style={{ fontSize: 18 }}>💗</Text>
            </View>
          </View>

          {stage === 'ask' ? (
            <>
              <Text style={{ fontSize: 26, fontWeight: '900', textAlign: 'center', color: theme.accent }}>
                {config.toName} — will you be my valentine?
              </Text>

              {!!config.note?.trim() && (
                <Text style={{ fontSize: 14, fontWeight: '700', textAlign: 'center', color: textSecondary }}>
                  {config.note}
                </Text>
              )}

              <Text style={{ fontSize: 12, fontWeight: '800', textAlign: 'center', color: textSecondary }}>
                From: {config.fromName}
              </Text>

              <View
                style={{
                  marginTop: 16,
                  width: '100%',
                  height: 110,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <AnimatedPressable
                    onPress={onYesPress}
                    onLayout={(e) => setYesBox(e.nativeEvent.layout)}
                    style={[
                      {
                        backgroundColor: theme.yes,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.22)',
                        paddingHorizontal: 24,
                        paddingVertical: 14,
                        borderRadius: 18
                      },
                      yesAnimated
                    ]}
                  >
                    <Text style={{ color: 'white', fontWeight: '900', fontSize: 16, letterSpacing: 0.2 }}>YES</Text>
                  </AnimatedPressable>

                  <AnimatedPressable
                    onPress={onNoPressEffective}
                    onLayout={(e) => setNoBox(e.nativeEvent.layout)}
                    style={[
                      {
                        backgroundColor: theme.no,
                  borderWidth: 1,
                  borderColor: softBorder,
                        paddingHorizontal: 24,
                        paddingVertical: 14,
                        borderRadius: 18
                      },
                      noAnimated
                    ]}
                  >
                    <Text style={{ color: '#111827', fontWeight: '900', fontSize: 16 }}>{noLabel}</Text>
                  </AnimatedPressable>
                </View>

                <Text style={{ marginTop: 12, fontSize: 12, color: textSecondary, fontWeight: '800' }}>
                  “No” seems a bit shy {forceEmbedded ? '' : '🙂'}
                </Text>
              </View>
            </>
          ) : (
            <>
              <Text style={{ fontSize: 26, fontWeight: '900', textAlign: 'center', color: theme.accent }}>
                YAY! 🎉
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '700', textAlign: 'center', color: textSecondary, marginBottom: 10 }}>
                {config.toName} said yes. Screenshot this.
              </Text>

              <View style={{ width: '100%', borderRadius: 18, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.06)' }}>
                <Image source={{ uri: gifUrl }} style={{ width: '100%', aspectRatio: 1.55 }} resizeMode="cover" />
              </View>

              <View style={{ marginTop: 14, flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
                <Pressable
                  onPress={() => setStage('ask')}
                  style={{ backgroundColor: 'rgba(17,24,39,0.08)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14 }}
                >
                  <Text style={{ fontWeight: '900', color: '#111827' }}>Replay</Text>
                </Pressable>
              </View>

              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                <ConfettiCannon count={110} origin={{ x: 0, y: 0 }} fadeOut />
              </View>
            </>
          )}
        </View>
      </View>

      <Modal visible={showJumpscare} transparent animationType="fade" onRequestClose={() => setShowJumpscare(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
          <View style={{ width: '100%', maxWidth: 520, borderRadius: 22, overflow: 'hidden', backgroundColor: 'white' }}>
            <View style={{ padding: 16, alignItems: 'center', gap: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: '900' }}>Wrong button 😈</Text>
              <Text style={{ color: '#6b7280', fontWeight: '700', textAlign: 'center' }}>
                The universe has only one correct answer.
              </Text>
            </View>
            <Image source={{ uri: gifUrl }} style={{ width: '100%', height: 260 }} resizeMode="cover" />
            <View style={{ padding: 14, flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={() => {
                  setShowJumpscare(false);
                  // force YES to be irresistible
                  yesScale.value = withSpring(2.0, { damping: 12, stiffness: 110 });
                  noOpacity.value = withTiming(0.15, { duration: 220 });
                  setNoDisabled(true);
                }}
                style={{ flex: 1, backgroundColor: theme.yes,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.22)', borderRadius: 16, paddingVertical: 12, alignItems: 'center' }}
              >
                <Text style={{ color: 'white', fontWeight: '900' }}>Okay… YES</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}
