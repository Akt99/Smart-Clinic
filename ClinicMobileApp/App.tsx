import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Alert,
  Easing,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

type OtpResponse = {
  message: string;
  mock_otp?: string;
};

type VerifyResponse = {
  access_token: string;
  token_type: string;
};

type AuthSession = {
  token: string;
  phoneNumber: string;
  fullName: string;
};

type DepartmentInfo = {
  name: string;
  description: string;
  doctors: string[];
  imageUri: string;
};

type AnimatedActionButtonProps = {
  label: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  onPress?: () => void;
};

const IOS_BASE_URL = 'http://localhost:8000/api/v1';
const ANDROID_EMULATOR_BASE_URL = 'http://10.0.2.2:8000/api/v1';
const DEPARTMENTS: DepartmentInfo[] = [
  {
    name: 'Psychiatry',
    description: 'Mental wellness, mood support, and emotional health guidance.',
    doctors: ['Dr. Sam Michael', 'Dr. Robin Ahmed'],
    imageUri: 'https://i.pinimg.com/1200x/95/50/7b/95507ba220ef508566c715ed9a6e13b1.jpg',
  },
  {
    name: 'Gynaecology',
    description: "Women's reproductive health, cycle care, and pregnancy support.",
    doctors: ['Dr. Tom Alter', 'Dr. Vikash Parekh'],
    imageUri: 'https://i.pinimg.com/1200x/04/44/ca/0444ca029f95209bba4f9c0dee1f82f5.jpg',
  },
  {
    name: 'Orthopaedics',
    description: 'Bone, joint, spine, and muscle-related treatment and recovery.',
    doctors: ['Dr. Ram Vilas', 'Dr. Amar Govind'],
    imageUri: 'https://i.pinimg.com/1200x/f0/7d/6c/f07d6c3299d53f64b121d4370d70a470.jpg',
  },
];

function normalizePhone(value: string): string {
  return value.replace(/\s+/g, '').trim();
}

function isValidPhone(value: string): boolean {
  return /^\+?\d{8,15}$/.test(value);
}

function isValidOtp(value: string): boolean {
  return /^\d{4,6}$/.test(value);
}

function AnimatedActionButton({
  label,
  backgroundColor,
  borderColor,
  textColor,
  onPress,
}: AnimatedActionButtonProps): React.JSX.Element {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const animateTo = (toScale: number, toTranslateY: number) => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: toScale,
        friction: 6,
        tension: 110,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: toTranslateY,
        friction: 6,
        tension: 110,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View style={{transform: [{scale}, {translateY}]}}>
      <Pressable
        style={[styles.secondaryButton, {backgroundColor, borderColor}]}
        onPress={onPress}
        onPressIn={() => animateTo(0.98, 1)}
        onPressOut={() => animateTo(1, 0)}
        onHoverIn={() => animateTo(1.02, -2)}
        onHoverOut={() => animateTo(1, 0)}>
        <Text style={[styles.secondaryButtonText, {color: textColor}]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

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
  const departmentCardAnimations = useRef(DEPARTMENTS.map(() => new Animated.Value(0))).current;

  const baseUrl = Platform.OS === 'android' ? ANDROID_EMULATOR_BASE_URL : IOS_BASE_URL;
  const homeTheme = {
    screenBg: isDarkMode ? '#0b1220' : '#f2f4f7',
    cardBg: isDarkMode ? '#111827' : '#ffffff',
    title: isDarkMode ? '#f8fafc' : '#101828',
    subtitle: isDarkMode ? '#cbd5e1' : '#475467',
    label: isDarkMode ? '#94a3b8' : '#667085',
    value: isDarkMode ? '#f8fafc' : '#101828',
    buttonBorder: isDarkMode ? '#334155' : '#d0d5dd',
    buttonBg: isDarkMode ? '#1f2937' : '#ffffff',
    buttonText: isDarkMode ? '#e2e8f0' : '#344054',
  };
  const loginTheme = {
    screenBg: '#0b1220',
    cardBg: '#111827',
    title: '#f8fafc',
    subtitle: '#cbd5e1',
    label: '#e2e8f0',
    inputBg: '#1f2937',
    inputBorder: '#334155',
    inputText: '#f8fafc',
    inputPlaceholder: '#94a3b8',
  };

  const cleanedPhone = normalizePhone(phoneNumber);
  const cleanedOtp = otp.trim();
  const cleanedName = fullName.trim();

  const canSendOtp = isValidPhone(cleanedPhone);
  const canVerifyOtp = otpSent && isValidPhone(cleanedPhone) && cleanedName.length >= 2 && isValidOtp(cleanedOtp);

  useEffect(() => {
    if (!showDepartments) {
      return;
    }
    departmentCardAnimations.forEach(value => value.setValue(0));
    Animated.stagger(
      120,
      departmentCardAnimations.map(value =>
        Animated.timing(value, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [showDepartments, departmentCardAnimations]);

  const sendOtp = async () => {
    if (!canSendOtp || sendingOtp) {
      return;
    }
    setSendingOtp(true);
    try {
      const res = await fetch(`${baseUrl}/auth/send-otp`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({phone_number: cleanedPhone}),
      });
      const data = (await res.json()) as OtpResponse | {detail?: string};
      if (!res.ok) {
        const detail = 'detail' in data && data.detail ? data.detail : 'Failed to send OTP';
        throw new Error(detail);
      }
      setOtpSent(true);
      setMockOtp('mock_otp' in data ? data.mock_otp ?? '' : '');
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
      const res = await fetch(`${baseUrl}/auth/verify-otp`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          phone_number: cleanedPhone,
          otp: cleanedOtp,
          full_name: cleanedName,
        }),
      });
      const data = (await res.json()) as VerifyResponse | {detail?: string};
      if (!res.ok) {
        const detail = 'detail' in data && data.detail ? data.detail : 'Failed to verify OTP';
        throw new Error(detail);
      }
      if (!('access_token' in data)) {
        throw new Error('Token missing in verify response');
      }
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

  if (session) {
    if (showDepartments) {
      return (
        <SafeAreaView style={[styles.safeArea, {backgroundColor: homeTheme.screenBg}]}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <ScrollView contentContainerStyle={styles.homeContainer}>
            <AnimatedActionButton
              label="Back to Home"
              backgroundColor={homeTheme.buttonBg}
              borderColor={homeTheme.buttonBorder}
              textColor={homeTheme.buttonText}
              onPress={() => setShowDepartments(false)}
            />

            <Text style={[styles.homeTitle, {color: homeTheme.title}]}>Our Departments</Text>
            <Text style={[styles.homeSubtitle, {color: homeTheme.subtitle}]}>
              We specialise in the following domains
            </Text>

            {DEPARTMENTS.map((department, index) => {
              const animationValue = departmentCardAnimations[index];
              const translateY = animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 0],
              });
              const scale = animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.98, 1],
              });

              return (
                <Animated.View
                  key={department.name}
                  style={[
                    styles.homeCard,
                    {
                      backgroundColor: homeTheme.cardBg,
                      opacity: animationValue,
                      transform: [{translateY}, {scale}],
                    },
                  ]}>
                  <Image source={{uri: department.imageUri}} style={styles.departmentImage} resizeMode="cover" />
                <Text style={[styles.sectionTitle, {color: homeTheme.title}]}>{department.name}</Text>
                <Text style={[styles.homeSubtitle, {color: homeTheme.subtitle, marginBottom: 10}]}>
                  {department.description}
                </Text>
                <Text style={[styles.homeLabel, {color: homeTheme.label}]}>Doctors</Text>
                {department.doctors.map(doctor => (
                  <Text key={doctor} style={[styles.homeValue, {color: homeTheme.value}]}>
                    • {doctor}
                  </Text>
                ))}
                </Animated.View>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={[styles.safeArea, {backgroundColor: homeTheme.screenBg}]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <ScrollView contentContainerStyle={styles.homeContainer}>
          <Text style={[styles.homeTitle, {color: homeTheme.title}]}>Home</Text>
          <Text style={[styles.homeSubtitle, {color: homeTheme.subtitle}]}>You are logged in with OTP.</Text>

          <View style={[styles.homeCard, {backgroundColor: homeTheme.cardBg}]}>
            <Text style={[styles.homeLabel, {color: homeTheme.label}]}>Name</Text>
            <Text style={[styles.homeValue, {color: homeTheme.value}]}>{session.fullName}</Text>
            <Text style={[styles.homeLabel, {color: homeTheme.label}]}>Phone</Text>
            <Text style={[styles.homeValue, {color: homeTheme.value}]}>{session.phoneNumber}</Text>
          </View>

          <View style={[styles.homeCard, {backgroundColor: homeTheme.cardBg}]}>
            <Text style={[styles.sectionTitle, {color: homeTheme.title}]}>Quick Actions</Text>
            <AnimatedActionButton
              label="Book Appointment"
              backgroundColor={homeTheme.buttonBg}
              borderColor={homeTheme.buttonBorder}
              textColor={homeTheme.buttonText}
            />
            <AnimatedActionButton
              label="My Appointments"
              backgroundColor={homeTheme.buttonBg}
              borderColor={homeTheme.buttonBorder}
              textColor={homeTheme.buttonText}
            />
            <AnimatedActionButton
              label="Health Assistant Chatbot"
              backgroundColor={homeTheme.buttonBg}
              borderColor={homeTheme.buttonBorder}
              textColor={homeTheme.buttonText}
            />
          </View>

          <View style={[styles.homeCard, {backgroundColor: homeTheme.cardBg}]}>
            <Text style={[styles.sectionTitle, {color: homeTheme.title}]}>About Us</Text>
            <AnimatedActionButton
              label="Our Departments"
              backgroundColor={homeTheme.buttonBg}
              borderColor={homeTheme.buttonBorder}
              textColor={homeTheme.buttonText}
              onPress={() => setShowDepartments(true)}
            />
          </View>

          <View style={[styles.homeCard, {backgroundColor: homeTheme.cardBg}]}>
            <Text style={[styles.sectionTitle, {color: homeTheme.title}]}>Settings</Text>
            <View style={styles.settingsRow}>
              <Text style={[styles.secondaryButtonText, {color: homeTheme.buttonText}]}>Theme </Text>
              <Switch
                value={isDarkMode}
                onValueChange={setIsDarkMode}
                trackColor={{false: '#d0d5dd', true: '#175cd3'}}
                thumbColor="#ffffff"
              />
            </View>
            <Pressable style={styles.logoutButton} onPress={logout}>
              <Text style={styles.buttonText}>Log Out</Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
            onChangeText={setPhoneNumber}
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
            onPress={sendOtp}
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
                onChangeText={setFullName}
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
                onChangeText={setOtp}
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
                onPress={verifyOtp}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f4f7',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#101828',
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 16,
    fontSize: 14,
    color: '#475467',
  },
  label: {
    marginTop: 10,
    marginBottom: 6,
    color: '#344054',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#101828',
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 14,
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: '#175cd3',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  mockOtp: {
    marginTop: 8,
    fontSize: 13,
    color: '#667085',
  },
  errorText: {
    marginTop: 6,
    color: '#b42318',
    fontSize: 12,
  },
  homeContainer: {
    padding: 20,
    gap: 14,
  },
  homeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#101828',
  },
  homeSubtitle: {
    color: '#475467',
    marginBottom: 4,
  },
  homeCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 3},
    elevation: 2,
  },
  departmentImage: {
    width: '100%',
    height: 130,
    borderRadius: 10,
    marginBottom: 12,
  },
  homeLabel: {
    fontSize: 12,
    color: '#667085',
    marginTop: 4,
  },
  homeValue: {
    fontSize: 16,
    color: '#101828',
    fontWeight: '600',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#101828',
    marginBottom: 10,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: '#344054',
    fontWeight: '600',
  },
  settingsRow: {
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 4,
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: '#b42318',
    alignItems: 'center',
  },
});

export default App;
