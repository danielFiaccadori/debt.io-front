import React from 'react';
import LottieView from 'lottie-react-native';

export default function LoginAnimation({source, loop = true, size = 350, offset = 0}) {
    return (
        <LottieView 
            source={source}
            autoPlay
            loop={loop}
            style={{ width: size, height: size, marginRight: offset }}
        />
    )
}