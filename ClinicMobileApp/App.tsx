import React, {useState} from 'react';
import {Alert, Platform} from 'react-native';

import {DepartmentsScreen} from './src/screens/DepartmentsScreen';
import {HomeScreen} from './src/screens/HomeScreen';
import {LoginScreen} from './src/screens/LoginScreen';
import {isValidOtp, isValidPhone, normalizePhone, requestOtp, verifyOtpRequest} from './src/services/auth';
import {getHomeTheme, loginTheme} from './src/theme/themes';
import {AuthSession} from './src/types/app';

const IOS_BASE_URL = 'http://localhost:8000/api/v1';
const ANDROID_EMULATOR_BASE_URL = 'http://10.0.2.2:8000/api/v1';

function App(): React.JSX.Element {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [mockOtp, setMockOtp] = useState('');
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showDepartments, setShowDepartments] = useState(false);

  const baseUrl = Platform.OS === 'android' ? ANDROID_EMULATOR_BASE_URL : IOS_BASE_URL;
  const homeTheme = getHomeTheme(isDarkMode);
  const cleanedPhone = normalizePhone(phoneNumber);
  const cleanedOtp = otp.trim();
  const cleanedName = fullName.trim();
  const canSendOtp = isValidPhone(cleanedPhone);
  const canVerifyOtp = otpSent && isValidPhone(cleanedPhone) && cleanedName.length >= 2 && isValidOtp(cleanedOtp);

  const sendOtp = async () => {
    if (!canSendOtp || sendingOtp) {
      return;
    }
    setSendingOtp(true);
    try {
      const data = await requestOtp(baseUrl, cleanedPhone);
      setOtpSent(true);
      setMockOtp(data.mock_otp ?? '');
      Alert.alert('OTP sent', 'Enter the OTP to continue.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      Alert.alert('Send OTP failed', message);
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (!canVerifyOtp || verifyingOtp) {
      return;
    }
    setVerifyingOtp(true);
    try {
      const data = await verifyOtpRequest(baseUrl, cleanedPhone, cleanedOtp, cleanedName);
      setSession({
        token: data.access_token,
        phoneNumber: cleanedPhone,
        fullName: cleanedName,
      });
      setOtp('');
      setMockOtp('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      Alert.alert('Verification failed', message);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const logout = () => {
    setSession(null);
    setShowDepartments(false);
    setPhoneNumber('');
    setFullName('');
    setOtp('');
    setOtpSent(false);
    setMockOtp('');
  };

  if (session && showDepartments) {
    return (
      <DepartmentsScreen
        isDarkMode={isDarkMode}
        theme={homeTheme}
        onBack={() => setShowDepartments(false)}
      />
    );
  }

  if (session) {
    return (
      <HomeScreen
        session={session}
        isDarkMode={isDarkMode}
        theme={homeTheme}
        onShowDepartments={() => setShowDepartments(true)}
        onLogout={logout}
        onToggleDarkMode={setIsDarkMode}
      />
    );
  }

  return (
    <LoginScreen
      phoneNumber={phoneNumber}
      fullName={fullName}
      otp={otp}
      otpSent={otpSent}
      sendingOtp={sendingOtp}
      verifyingOtp={verifyingOtp}
      canSendOtp={canSendOtp}
      canVerifyOtp={canVerifyOtp}
      mockOtp={mockOtp}
      cleanedOtp={cleanedOtp}
      loginTheme={loginTheme}
      onChangePhoneNumber={setPhoneNumber}
      onChangeFullName={setFullName}
      onChangeOtp={setOtp}
      onSendOtp={sendOtp}
      onVerifyOtp={verifyOtp}
      isValidOtp={isValidOtp}
    />
  );
}

export default App;
