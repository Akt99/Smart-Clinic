export type OtpResponse = {
  message: string;
  mock_otp?: string;
};

export type VerifyResponse = {
  access_token: string;
  token_type: string;
};

export type AuthSession = {
  token: string;
  phoneNumber: string;
  fullName: string;
};

export type DepartmentInfo = {
  name: string;
  description: string;
  doctors: string[];
  imageUri: string;
};

export type HomeTheme = {
  screenBg: string;
  cardBg: string;
  title: string;
  subtitle: string;
  label: string;
  value: string;
  buttonBorder: string;
  buttonBg: string;
  buttonText: string;
};

export type LoginTheme = {
  screenBg: string;
  cardBg: string;
  title: string;
  subtitle: string;
  label: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
};
