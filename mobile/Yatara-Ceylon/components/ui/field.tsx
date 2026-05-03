import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { Brand } from '@/constants/brand';

type Props = TextInputProps & {
  label: string;
  error?: string;
  /** Pale form surfaces (booking request, etc.) */
  variant?: 'dark' | 'light';
};

export function Field({ label, error, style, variant = 'dark', ...rest }: Props) {
  const light = variant === 'light';
  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, light && styles.labelLight]}>{label}</Text>
      <TextInput
        placeholderTextColor={Brand.muted}
        style={[styles.input, light && styles.inputLight, error ? styles.inputError : null, style]}
        {...rest}
      />
      {error ? (
        <Text style={[styles.error, light && styles.errorLight]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.offWhite,
    marginBottom: 6,
    opacity: 0.9,
  },
  labelLight: { color: Brand.deepEmerald, opacity: 1 },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Brand.offWhite,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  inputLight: {
    color: '#111827',
    backgroundColor: Brand.white,
    borderColor: Brand.border,
  },
  inputError: { borderColor: Brand.danger },
  error: { color: '#FCA5A5', marginTop: 4, fontSize: 13 },
  errorLight: { color: Brand.danger },
});
