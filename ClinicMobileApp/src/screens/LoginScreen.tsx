import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';

import {styles} from '../styles/appStyles';
import {LoginTheme} from '../types/app';

type LoginScreenProps = {
  phoneNumber: string;
  fullName: string;
  otp: string;
  otpSent: boolean;
  sendingOtp: boolean;
  verifyingOtp: boolean;
  canSendOtp: boolean;
  canVerifyOtp: boolean;
  mockOtp: string;
  cleanedOtp: string;
  loginTheme: LoginTheme;
  onChangePhoneNumber: (value: string) => void;
  onChangeFullName: (value: string) => void;
  onChangeOtp: (value: string) => void;
  onSendOtp: () => void;
  onVerifyOtp: () => void;
  isValidOtp: (value: string) => boolean;
};

export function LoginScreen({
  phoneNumber,
  fullName,
  otp,
  otpSent,
  sendingOtp,
  verifyingOtp,
  canSendOtp,
  canVerifyOtp,
  mockOtp,
  cleanedOtp,
  loginTheme,
  onChangePhoneNumber,
  onChangeFullName,
  onChangeOtp,
  onSendOtp,
  onVerifyOtp,
  isValidOtp,
}: LoginScreenProps): React.JSX.Element {
  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: loginTheme.screenBg}]}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[styles.card, {backgroundColor: loginTheme.cardBg}]}>
          <Text style={[styles.title, {color: loginTheme.title}]}>Login</Text>
          <Text style={[styles.subtitle, {color: loginTheme.subtitle}]}>Please log in to move ahead...</Text>

          <Text style={[styles.label, {color: loginTheme.label}]}>Phone Number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={onChangePhoneNumber}
            placeholder="+91XXXXXXXXXX"
            placeholderTextColor={loginTheme.inputPlaceholder}
            keyboardType="phone-pad"
            autoCapitalize="none"
            style={[
              styles.input,
              {
                backgroundColor: loginTheme.inputBg,
                borderColor: loginTheme.inputBorder,
                color: loginTheme.inputText,
              },
            ]}
          />
          {!canSendOtp && phoneNumber.length > 0 ? (
            <Text style={styles.errorText}>Enter a valid phone number.</Text>
          ) : null}

          <Pressable
            style={[styles.button, (!canSendOtp || sendingOtp) && styles.buttonDisabled]}
            onPress={onSendOtp}
            disabled={!canSendOtp || sendingOtp}>
            {sendingOtp ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>{otpSent ? 'Resend OTP' : 'Send OTP'}</Text>
            )}
          </Pressable>

          {otpSent ? (
            <>
              <Text style={[styles.label, {color: loginTheme.label}]}>Full Name</Text>
              <TextInput
                value={fullName}
                onChangeText={onChangeFullName}
                placeholder="Enter your full name"
                placeholderTextColor={loginTheme.inputPlaceholder}
                autoCapitalize="words"
                style={[
                  styles.input,
                  {
                    backgroundColor: loginTheme.inputBg,
                    borderColor: loginTheme.inputBorder,
                    color: loginTheme.inputText,
                  },
                ]}
              />

              <Text style={[styles.label, {color: loginTheme.label}]}>OTP</Text>
              <TextInput
                value={otp}
                onChangeText={onChangeOtp}
                placeholder="4 to 6 digit OTP"
                placeholderTextColor={loginTheme.inputPlaceholder}
                keyboardType="number-pad"
                autoCapitalize="none"
                style={[
                  styles.input,
                  {
                    backgroundColor: loginTheme.inputBg,
                    borderColor: loginTheme.inputBorder,
                    color: loginTheme.inputText,
                  },
                ]}
              />

              {!isValidOtp(cleanedOtp) && cleanedOtp.length > 0 ? (
                <Text style={styles.errorText}>OTP must be 4 to 6 digits.</Text>
              ) : null}

              {mockOtp ? <Text style={[styles.mockOtp, {color: loginTheme.subtitle}]}>Mock OTP: {mockOtp}</Text> : null}

              <Pressable
                style={[styles.button, (!canVerifyOtp || verifyingOtp) && styles.buttonDisabled]}
                onPress={onVerifyOtp}
                disabled={!canVerifyOtp || verifyingOtp}>
                {verifyingOtp ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Verify & Continue</Text>
                )}
              </Pressable>
            </>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
