import { Link } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function NotFound() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 18 }}>
      <Text style={{ fontSize: 22, fontWeight: '900' }}>Page not found</Text>
      <Text style={{ marginTop: 8, color: '#6b7280', textAlign: 'center' }}>
        This link doesn’t exist. Go back home and build a new OnlyYes page.
      </Text>
      <Link href="/" asChild>
        <Pressable style={{ marginTop: 16, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, backgroundColor: '#111827' }}>
          <Text style={{ color: 'white', fontWeight: '900' }}>Home</Text>
        </Pressable>
      </Link>
    </View>
  );
}
