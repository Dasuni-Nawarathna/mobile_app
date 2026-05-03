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
import { validateEmail, validatePassword, validateRequired } from '@/lib/validation';

export default function RegisterScreen() {
  const { signUp, user, initializing, authError, clearAuthError } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<'firstName' | 'lastName' | 'email' | 'password' | 'confirm', string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  if (!initializing && user) {
    return <Redirect href="/home" />;
  }

  function validate(): boolean {
    const next = {
      firstName: validateRequired(firstName, 'First name'),
      lastName: validateRequired(lastName, 'Last name'),
      email: validateEmail(email),
      password: validatePassword(password),
      confirm: !confirm
        ? 'Confirm your password'
        : confirm !== password
          ? 'Passwords do not match'
          : undefined,
    };
    setFieldErrors(next);
    return !Object.values(next).some(Boolean);
  }

  async function onSubmit() {
    clearAuthError();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await signUp({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
    } catch {
      /* authError surfaced from context */
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
        <Text style={styles.kicker}>Join Yatara Ceylon</Text>
        <Text style={styles.title}>Open your travel dossier</Text>

        {authError ? <Text style={styles.banner}>{authError}</Text> : null}

        <Field
          label="First name"
          error={fieldErrors.firstName}
          autoCapitalize="words"
          value={firstName}
          onChangeText={(t) => {
            setFirstName(t);
            if (fieldErrors.firstName)
              setFieldErrors((p) => ({ ...p, firstName: undefined }));
          }}
        />
        <Field
          label="Last name"
          error={fieldErrors.lastName}
          autoCapitalize="words"
          value={lastName}
          onChangeText={(t) => {
            setLastName(t);
            if (fieldErrors.lastName) setFieldErrors((p) => ({ ...p, lastName: undefined }));
          }}
        />
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
        <Field
          label="Confirm password"
          error={fieldErrors.confirm}
          secureTextEntry
          value={confirm}
          onChangeText={(t) => {
            setConfirm(t);
            if (fieldErrors.confirm) setFieldErrors((p) => ({ ...p, confirm: undefined }));
          }}
        />

        <PrimaryButton title="Create account" loading={submitting} onPress={onSubmit} />

        <View style={styles.footer}>
          <Text style={styles.muted}>Already registered?</Text>
          <Link href="/(auth)/login" asChild>
            <Pressable>
              <Text style={styles.link}>Sign in</Text>
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
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 22,
  },
  banner: {
    backgroundColor: 'rgba(185,28,28,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(252,165,165,0.4)',
    color: '#FECACA',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  footer: { marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 8 },
  muted: { color: 'rgba(250,250,250,0.6)' },
  link: { color: Brand.antiqueGold, fontWeight: '700', textDecorationLine: 'underline' },
});
