import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';
import ValentineCard from '../../components/ValentineCard';
import { decodeConfig } from '../../utils/codec';

export default function ValentineLink() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const cfg = typeof code === 'string' ? decodeConfig(code) : null;

  if (!cfg) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 18 }}>
        <Text style={{ fontSize: 18, fontWeight: '900' }}>Invalid link</Text>
        <Text style={{ marginTop: 8, color: '#6b7280', textAlign: 'center' }}>
          This OnlyYes link looks broken. Ask the sender to generate a new one.
        </Text>
      </View>
    );
  }

  return <ValentineCard config={cfg} />;
}
