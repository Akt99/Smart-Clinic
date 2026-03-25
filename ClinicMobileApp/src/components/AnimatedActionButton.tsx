import React, {useRef} from 'react';
import {Animated, Pressable, Text, View} from 'react-native';

import {styles} from '../styles/appStyles';

type AnimatedActionButtonProps = {
  label: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  onPress?: () => void;
  iconGlyph?: string;
};

export function AnimatedActionButton({
  label,
  backgroundColor,
  borderColor,
  textColor,
  onPress,
  iconGlyph,
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
        <View style={styles.buttonContent}>
          {iconGlyph ? (
            <View style={[styles.glyphBadge, {borderColor: textColor}]}>
              <Text style={[styles.glyphText, {color: textColor}]}>{iconGlyph}</Text>
            </View>
          ) : null}
          <Text style={[styles.secondaryButtonText, {color: textColor}]}>{label}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}
