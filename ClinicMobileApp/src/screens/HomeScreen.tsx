import React from 'react';
import {Pressable, SafeAreaView, ScrollView, StatusBar, Switch, Text, View} from 'react-native';

import {AnimatedActionButton} from '../components/AnimatedActionButton';
import {styles} from '../styles/appStyles';
import {AuthSession, HomeTheme} from '../types/app';

type HomeScreenProps = {
  session: AuthSession;
  isDarkMode: boolean;
  theme: HomeTheme;
  onShowDepartments: () => void;
  onLogout: () => void;
  onToggleDarkMode: (value: boolean) => void;
};

export function HomeScreen({
  session,
  isDarkMode,
  theme,
  onShowDepartments,
  onLogout,
  onToggleDarkMode,
}: HomeScreenProps): React.JSX.Element {
  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.screenBg}]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        <Text style={[styles.homeTitle, {color: theme.title}]}>Home</Text>
        <Text style={[styles.homeSubtitle, {color: theme.subtitle}]}>You are logged in with OTP.</Text>

        <View style={[styles.homeCard, {backgroundColor: theme.cardBg}]}>
          <Text style={[styles.homeLabel, {color: theme.label}]}>Name</Text>
          <Text style={[styles.homeValue, {color: theme.value}]}>{session.fullName}</Text>
          <Text style={[styles.homeLabel, {color: theme.label}]}>Phone</Text>
          <Text style={[styles.homeValue, {color: theme.value}]}>{session.phoneNumber}</Text>
        </View>

        <View style={[styles.homeCard, {backgroundColor: theme.cardBg}]}>
          <Text style={[styles.sectionTitle, {color: theme.title}]}>Quick Actions</Text>
          <AnimatedActionButton
            label="Book Appointment"
            backgroundColor={theme.buttonBg}
            borderColor={theme.buttonBorder}
            textColor={theme.buttonText}
          />
          <AnimatedActionButton
            label="My Appointments"
            backgroundColor={theme.buttonBg}
            borderColor={theme.buttonBorder}
            textColor={theme.buttonText}
          />
          <AnimatedActionButton
            label="Health Assistant Chatbot"
            backgroundColor={theme.buttonBg}
            borderColor={theme.buttonBorder}
            textColor={theme.buttonText}
          />
        </View>

        <View style={[styles.homeCard, {backgroundColor: theme.cardBg}]}>
          <Text style={[styles.sectionTitle, {color: theme.title}]}>About Us</Text>
          <AnimatedActionButton
            label="Our Departments"
            backgroundColor={theme.buttonBg}
            borderColor={theme.buttonBorder}
            textColor={theme.buttonText}
            onPress={onShowDepartments}
          />
        </View>

        <View style={[styles.homeCard, {backgroundColor: theme.cardBg}]}>
          <Text style={[styles.sectionTitle, {color: theme.title}]}>Settings</Text>
          <View style={styles.settingsRow}>
            <Text style={[styles.secondaryButtonText, {color: theme.buttonText}]}>Theme </Text>
            <Switch
              value={isDarkMode}
              onValueChange={onToggleDarkMode}
              trackColor={{false: '#d0d5dd', true: '#175cd3'}}
              thumbColor="#ffffff"
            />
          </View>
          <Pressable style={styles.logoutButton} onPress={onLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
