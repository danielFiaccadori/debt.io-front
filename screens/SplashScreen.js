import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, Image, FlatList, Animated, Dimensions, InteractionManager } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';
import * as NavigationBar from 'expo-navigation-bar';
import SplashLargeButton from '../components/LargeButton';
import LoginAnimation from '../components/LoginAnimation';

const { width } = Dimensions.get('window');

const slides = [
	{
		id: '1',
		image: require('../assets/animations/splash_animation2.json'),
		title: 'Facilidade e controle',
		subtitle: 'Gerencie tudo do celular',
		colors: ['#05050a', '#18172b', '#05050a'],
		size: '600',
		offset: '90'

	},
	{
		id: '2',
		image: require('../assets/animations/splash_animation1.json'),
		title: 'Tudo nas suas mãos',
		subtitle: 'De onde estiver, quando quiser',
		colors: ['#05050a', '#18172b', '#05050a'],
		size: '350',
		offset: '0'	
	},
	{
		id: '3',
		image: require('../assets/animations/splash_animation3.json'),
		title: 'Fácil e simples',
		subtitle: 'Promovendo controle',
		colors: ['#05050a', '#18172b', '#05050a'],
		size: '350',
		offset: '0',
	}
];

const SplashScreen = ({ navigation }) => {
	const handleNavigation = () => {
        navigation.navigate("LoginScreen");
    }

	const [fontsLoaded] = useFonts({
		Inter_400Regular,
		Inter_700Bold,
	});

	const scrollX = useRef(new Animated.Value(0)).current;
	const fadeAnim = useRef(new Animated.Value(1)).current;
	const [currentIndex, setCurrentIndex] = useState(0);

	useFocusEffect(
		React.useCallback(() => {
		  const run = async () => {
			await InteractionManager.runAfterInteractions();
			
			NavigationBar.setBackgroundColorAsync('#ffffff00');
			NavigationBar.setPositionAsync('absolute');
		  };
		  run();
		  return () => {};
		}, [])
	);

	const fadeInOut = () => {
		fadeAnim.setValue(0);
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 1000,
			useNativeDriver: true,
		}).start();
	};

	const onViewableItemsChanged = useRef(({ viewableItems }) => {
		if (viewableItems.length > 0) {
			fadeInOut();
			setCurrentIndex(viewableItems[0].index);
		}
	}).current;

	const viewabilityConfig = useRef({
		viewAreaCoveragePercentThreshold: 50,
	}).current;

	return (
		<SafeAreaProvider>
			<LinearGradient
				colors={slides[currentIndex].colors}
				start={{ x: 0, y: 0 }}
				end={{ x: 0.5, y: 1 }}
				style={styles.gradient}
			>
				<SafeAreaView style={styles.container}>
					<StatusBar translucent backgroundColor="transparent" style="light" />
					<View style={styles.container}>
						<Image style={styles.logo} source={require('../assets/debt.io-logo.png')} />
						<Animated.FlatList
							data={slides}
							keyExtractor={item => item.id}
							horizontal
							pagingEnabled
							showsHorizontalScrollIndicator={false}
							onScroll={Animated.event(
								[{ nativeEvent: { contentOffset: { x: scrollX } } }],
								{ useNativeDriver: false }
							)}
							onViewableItemsChanged={onViewableItemsChanged}
							viewabilityConfig={viewabilityConfig}
							renderItem={({ item }) => (
								<Animated.View style={{ width, alignItems: 'center', justifyContent: 'center'}}>
									<LoginAnimation source={item.image} loop={true} size={item.size} offset={item.offset}/>
								</Animated.View>
							)}
						/>
					</View>

					<BlurView 
						intensity={40} 
						tint="dark" 
						style={styles.titleContainer}
						experimentalBlurMethod='none'
						>
						<View style={styles.dotsContainer}>
						{slides.map((_, index) => {
							const inputRange = [
								(index - 1) * width,
								index * width,
								(index + 1) * width,
							];

							const dotWidth = scrollX.interpolate({
								inputRange,
								outputRange: [8, 25, 8],
								extrapolate: 'clamp',
							});

							const dotShadow = scrollX.interpolate({
								inputRange,
								outputRange: [0, 10, 0],
								extrapolate: 'clamp',
							});

							const backgroundColor = scrollX.interpolate({
								inputRange,
								outputRange: [
									'rgba(255,255,255,0.3)', 
									'white', 
									'rgba(255,255,255,0.3)'
								],
								extrapolate: 'clamp',
							});

							return (
								<Animated.View
									key={index}
									style={[
										styles.dot,
										{
											width: dotWidth,
											backgroundColor: backgroundColor,
											elevation: dotShadow
										},
									]}
								/>
							);
						})}
						</View>

						<Animated.View style={[styles.titleContainerText, { opacity: fadeAnim }]}>
							<Text style={styles.title}>{slides[currentIndex].title}</Text>
							<Text style={styles.subtitle}>{slides[currentIndex].subtitle}</Text>
						</Animated.View>
						<View style={styles.buttonView}> 
							<SplashLargeButton onPress={handleNavigation} placeholder="Começar"/>
						</View>
					</BlurView>
				</SafeAreaView>
			</LinearGradient>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	gradient: {
		flex: 1,
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	logo: {
		width: 120,
		height: 120
	},
	splashImage: {
		opacity: 1,
		marginTop: 25,
		width: 350,
		height: 350
	},
	buttonView: {
		marginBottom: 70,
	},
	titleContainer: {
		marginTop: 'auto',
		borderTopLeftRadius: 30,
		borderTopRightRadius: 30,
		borderWidth: 1,
		borderColor: 'rgba(255, 255, 255, 0.075)',
		borderBottomWidth: 0,
		overflow: 'hidden',
		height: "40%",
		width: '100%',
		bottom: -50,
		paddingHorizontal: 40,
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleContainerText: {
		marginTop: '5%',
		width: '100%',
	},
	title: {
		color: 'white',
		fontSize: 25,
		fontFamily: 'Inter_700Bold',
		marginBottom: 10,
		textAlign: 'left',
	},
	subtitle: {
		color: 'white',
		fontSize: 15,
		fontFamily: 'Inter_400Regular',
		textAlign: 'left',
	},
	dotsContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 25,
		marginBottom: 10
	},
	dot: {
		height: 8,
		borderRadius: 4,
		backgroundColor: 'rgba(255, 255, 255, 0.3)',
		marginHorizontal: 4,
	},
	
});

export default SplashScreen;
