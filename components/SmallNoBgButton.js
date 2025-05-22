import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Octicons } from '@expo/vector-icons';

const SmallNoBgButton = ({ onPress, icon }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.SmallNoBgButton}>
            <Octicons name={icon} size={20} color="white"/>
        </TouchableOpacity>
    );
}

export default SmallNoBgButton;

const styles = StyleSheet.create({
    SmallNoBgButton: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center'
    }
});