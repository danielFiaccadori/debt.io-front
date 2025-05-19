import React from 'react';
import { View, StyleSheet } from 'react-native';

const StepDotsIndicator = ({ currentStep, totalSteps = 3, activeColor = '#5C8374', inactiveColor = '#a8e0ca', size = 12, spacing = 8 }) => {
  const dots = [];

  for (let i = 1; i <= totalSteps; i++) {
    dots.push(
      <View
        key={i}
        style={[
          styles.dot,
          {
            backgroundColor: i === currentStep ? activeColor : inactiveColor,
            width: size,
            height: size,
            marginHorizontal: spacing / 2,
          },
        ]}
      />
    );
  }

  return <View style={styles.container}>{dots}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  dot: {
    borderRadius: 100,
  },
});

export default StepDotsIndicator;
