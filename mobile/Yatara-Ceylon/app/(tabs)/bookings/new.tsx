import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';

import { PrimaryButton } from '@/components/ui/primary-button';
import { Field } from '@/components/ui/field';
import { Brand } from '@/constants/brand';
import { useAuth } from '@/contexts/auth-context';
import { ApiError } from '@/lib/api/client';
import { createBooking } from '@/lib/api/services/bookings';
import { validateEmail, validatePhone, validateRequired } from '@/lib/validation';

export default function NewBookingScreen() {
  const { token, user } = useAuth();
  const router = useRouter();
  const { packageId, packageTitle } = useLocalSearchParams<{
    packageId?: string;
    packageTitle?: string;
  }>();

  const [customerName, setCustomerName] = useState(
    user ? `${user.firstName} ${user.lastName}`.trim() : ''
  );
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pkgId, setPkgId] = useState(packageId ? String(packageId) : '');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<
      Record<'customerName' | 'email' | 'phone' | 'packageId' | 'startDate' | 'endDate', string>
    >
  >({});

  function validate(): boolean {
    const next = {
      customerName: validateRequired(customerName, 'Guest name'),
      email: validateEmail(email),
      phone: validatePhone(phone),
      packageId: validateRequired(pkgId, 'Package id'),
      startDate: validateRequired(startDate, 'Start date'),
      endDate: validateRequired(endDate, 'End date'),
    };
    if (startDate && endDate && startDate > endDate) {
      next.endDate = 'End date must be on or after start';
    }
    setFieldErrors(next);
    return !Object.values(next).some(Boolean);
  }

  async function onSubmit() {
    setFormError(null);
    if (!token) {
      setFormError('Not signed in');
      return;
    }
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createBooking(token, {
        customerName: customerName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        packageId: pkgId.trim(),
        dates: { from: startDate.trim(), to: endDate.trim() },
        notes: notes.trim() || undefined,
      });
      router.replace('/bookings');
    } catch (e) {
      setFormError(e instanceof ApiError ? e.message : 'Could not create booking');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {packageTitle ? (
          <Text style={styles.prefill}>Journey: {packageTitle}</Text>
        ) : null}

        {formError ? <Text style={styles.banner}>{formError}</Text> : null}

        <Field
          variant="light"
          label="Guest name"
          error={fieldErrors.customerName}
          value={customerName}
          onChangeText={(t) => {
            setCustomerName(t);
            if (fieldErrors.customerName)
              setFieldErrors((p) => ({ ...p, customerName: undefined }));
          }}
        />
        <Field
          variant="light"
          label="Email"
          error={fieldErrors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
          }}
        />
        <Field
          variant="light"
          label="Phone (E.164 or local)"
          error={fieldErrors.phone}
          keyboardType="phone-pad"
          value={phone}
          onChangeText={(t) => {
            setPhone(t);
            if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: undefined }));
          }}
        />
        <Field
          variant="light"
          label="Package id"
          error={fieldErrors.packageId}
          autoCapitalize="none"
          value={pkgId}
          onChangeText={(t) => {
            setPkgId(t);
            if (fieldErrors.packageId) setFieldErrors((p) => ({ ...p, packageId: undefined }));
          }}
        />
        <Field
          variant="light"
          label="Start date (YYYY-MM-DD)"
          error={fieldErrors.startDate}
          placeholder="2026-06-01"
          autoCapitalize="none"
          value={startDate}
          onChangeText={(t) => {
            setStartDate(t);
            if (fieldErrors.startDate) setFieldErrors((p) => ({ ...p, startDate: undefined }));
          }}
        />
        <Field
          variant="light"
          label="End date (YYYY-MM-DD)"
          error={fieldErrors.endDate}
          placeholder="2026-06-07"
          autoCapitalize="none"
          value={endDate}
          onChangeText={(t) => {
            setEndDate(t);
            if (fieldErrors.endDate) setFieldErrors((p) => ({ ...p, endDate: undefined }));
          }}
        />
        <Field
          variant="light"
          label="Notes (optional)"
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
          style={{ minHeight: 88, textAlignVertical: 'top' }}
        />

        <PrimaryButton title="Submit request" loading={submitting} onPress={onSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Brand.offWhite },
  scroll: { padding: 20, paddingBottom: 40 },
  prefill: {
    fontSize: 15,
    fontWeight: '600',
    color: Brand.deepEmerald,
    marginBottom: 12,
  },
  banner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    color: Brand.danger,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
});
