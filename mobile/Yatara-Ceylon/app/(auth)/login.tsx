import { Link, Redirect } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PrimaryButton } from '@/components/ui/primary-button';
import { Field } from '@/components/ui/field';
import { Brand } from '@/constants/brand';
import { useAuth } from '@/contexts/auth-context';
import { validateEmail, validatePassword } from '@/lib/validation';

export default function LoginScreen() {
  const { signIn, user, initializing, authError, clearAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  if (!initializing && user) {
    return <Redirect href="/home" />;
  }

  function validate(): boolean {
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setFieldErrors({ email: eErr, password: pErr });
    return !eErr && !pErr;
  }

  async function onSubmit() {
    clearAuthError();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
    } catch {
      /* message shown via authError */
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>Yatara Ceylon</Text>
        <Text style={styles.title}>Luxury transfers &amp; journeys</Text>
        <Text style={styles.lead}>Sign in to manage bookings and explore curated routes.</Text>

        {authError ? <Text style={styles.banner}>{authError}</Text> : null}

        <Field
          label="Email"
          error={fieldErrors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
          }}
        />
        <Field
          label="Password"
          error={fieldErrors.password}
          secureTextEntry
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
          }}
        />

        <PrimaryButton title="Sign in" loading={submitting} onPress={onSubmit} style={styles.cta} />

        <View style={styles.footer}>
          <Text style={styles.muted}>New here?</Text>
          <Link href="/(auth)/register" asChild>
            <Pressable>
              <Text style={styles.link}>Create an account</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Brand.deepEmerald },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  kicker: {
    color: Brand.antiqueGold,
    fontSize: 12,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    color: Brand.offWhite,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  lead: { color: 'rgba(250,250,250,0.75)', fontSize: 16, lineHeight: 22, marginBottom: 28 },
  banner: {
    backgroundColor: 'rgba(185,28,28,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(252,165,165,0.4)',
    color: '#FECACA',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  cta: { marginTop: 8 },
  footer: { marginTop: 28, flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  muted: { color: 'rgba(250,250,250,0.6)' },
  link: { color: Brand.antiqueGold, fontWeight: '700', textDecorationLine: 'underline' },
});
