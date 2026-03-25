import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Image, SafeAreaView, ScrollView, StatusBar, Text, View} from 'react-native';

import {DEPARTMENTS} from '../constants/departments';
import {AnimatedActionButton} from '../components/AnimatedActionButton';
import {styles} from '../styles/appStyles';
import {HomeTheme} from '../types/app';

type DepartmentsScreenProps = {
  isDarkMode: boolean;
  theme: HomeTheme;
  onBack: () => void;
};

export function DepartmentsScreen({
  isDarkMode,
  theme,
  onBack,
}: DepartmentsScreenProps): React.JSX.Element {
  const departmentCardAnimations = useRef(DEPARTMENTS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
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
  }, [departmentCardAnimations]);

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.screenBg}]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.homeContainer}>
        <AnimatedActionButton
          label="Back to Home"
          backgroundColor={theme.buttonBg}
          borderColor={theme.buttonBorder}
          textColor={theme.buttonText}
          onPress={onBack}
          iconGlyph="<"
        />

        <Text style={[styles.homeTitle, {color: theme.title}]}>Our Departments</Text>
        <Text style={[styles.homeSubtitle, {color: theme.subtitle}]}>We specialise in the following domains</Text>

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
                  backgroundColor: theme.cardBg,
                  opacity: animationValue,
                  transform: [{translateY}, {scale}],
                },
              ]}>
              <Image source={{uri: department.imageUri}} style={styles.departmentImage} resizeMode="cover" />
              <Text style={[styles.sectionTitle, {color: theme.title}]}>{department.name}</Text>
              <Text style={[styles.homeSubtitle, {color: theme.subtitle, marginBottom: 10}]}>
                {department.description}
              </Text>
              <Text style={[styles.homeLabel, {color: theme.label}]}>Doctors</Text>
              {department.doctors.map(doctor => (
                <Text key={doctor} style={[styles.homeValue, {color: theme.value}]}>
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
