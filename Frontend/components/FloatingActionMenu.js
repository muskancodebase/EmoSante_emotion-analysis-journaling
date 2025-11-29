<<<<<<< HEAD
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    TouchableWithoutFeedback,
} from 'react-native';
import theme from '../theme';

const { colors, shadows, spacing, typography } = theme;

export default function FloatingActionMenu({ navigation }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        const toValue = isExpanded ? 0 : 1;

        Animated.spring(animation, {
            toValue,
            friction: 5,
            useNativeDriver: true,
        }).start();

        setIsExpanded(!isExpanded);
    };

    const closeMenu = () => {
        if (isExpanded) {
            toggleMenu();
        }
    };

    // Animation styles
    const getButtonStyle = (index) => {
        const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -60 * (index + 1)],
        });

        const opacity = animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0, 1],
        });

        const scale = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
        });

        return {
            transform: [{ translateY }, { scale }],
            opacity,
        };
    };

    const rotation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    return (
        <View style={styles.container} pointerEvents="box-none">
            {/* Backdrop to close menu when clicking outside */}
            {isExpanded && (
                <TouchableWithoutFeedback onPress={closeMenu}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>
            )}

            <View style={styles.menuContainer} pointerEvents="box-none">
                {/* Search Button */}
                <Animated.View style={[styles.buttonWrapper, getButtonStyle(2)]}>
                    <TouchableOpacity
                        style={[styles.subButton, { backgroundColor: colors.surface }]}
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('SearchEntries');
                        }}
                    >
                        <Text style={styles.subButtonIcon}>🔍</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Record Button */}
                <Animated.View style={[styles.buttonWrapper, getButtonStyle(1)]}>
                    <TouchableOpacity
                        style={[styles.subButton, { backgroundColor: colors.surface }]}
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('AudioToText');
                        }}
                    >
                        <Text style={styles.subButtonIcon}>🎙️</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Add Button (Manual Entry) */}
                <Animated.View style={[styles.buttonWrapper, getButtonStyle(0)]}>
                    <TouchableOpacity
                        style={[styles.subButton, { backgroundColor: colors.surface }]}
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('AddJournal');
                        }}
                    >
                        <Text style={styles.subButtonIcon}>✏️</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Main Toggle Button */}
                <TouchableOpacity
                    style={styles.mainButton}
                    onPress={toggleMenu}
                    activeOpacity={0.9}
                >
                    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                        {isExpanded ? (
                            <Text style={styles.mainButtonIcon}>+</Text>
                        ) : (
                            <View style={styles.logoContainer}>
                                <Text style={styles.logoText}>E</Text>
                            </View>
                        )}
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    menuContainer: {
        position: 'absolute',
        bottom: spacing.xl,
        right: spacing.xl,
        alignItems: 'center',
    },
    buttonWrapper: {
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.soft,
        zIndex: 10,
        borderWidth: 3,
        borderColor: colors.surfaceSoft,
    },
    logoContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    logoText: {
        fontFamily: typography.fontFamilyPrimary,
        fontSize: 28,
        fontWeight: '800',
        color: colors.surfaceSoft, // Beige text on Lilac background
        includeFontPadding: false,
    },
    mainButtonIcon: {
        fontFamily: typography.fontFamilyPrimary,
        fontSize: 36,
        color: colors.surfaceSoft,
        lineHeight: 40,
    },
    subButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.soft,
    },
    subButtonIcon: {
        fontSize: 22,
    },
});
=======
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    TouchableWithoutFeedback,
} from 'react-native';
import theme from '../theme';

const { colors, shadows, spacing, typography } = theme;

export default function FloatingActionMenu({ navigation }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const animation = useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        const toValue = isExpanded ? 0 : 1;

        Animated.spring(animation, {
            toValue,
            friction: 5,
            useNativeDriver: true,
        }).start();

        setIsExpanded(!isExpanded);
    };

    const closeMenu = () => {
        if (isExpanded) {
            toggleMenu();
        }
    };

    // Animation styles
    const getButtonStyle = (index) => {
        const translateY = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -60 * (index + 1)],
        });

        const opacity = animation.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0, 1],
        });

        const scale = animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
        });

        return {
            transform: [{ translateY }, { scale }],
            opacity,
        };
    };

    const rotation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    return (
        <View style={styles.container} pointerEvents="box-none">
            {/* Backdrop to close menu when clicking outside */}
            {isExpanded && (
                <TouchableWithoutFeedback onPress={closeMenu}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>
            )}

            <View style={styles.menuContainer} pointerEvents="box-none">
                {/* Search Button */}
                <Animated.View style={[styles.buttonWrapper, getButtonStyle(2)]}>
                    <TouchableOpacity
                        style={[styles.subButton, { backgroundColor: colors.surface }]}
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('SearchEntries');
                        }}
                    >
                        <Text style={styles.subButtonIcon}>🔍</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Record Button */}
                <Animated.View style={[styles.buttonWrapper, getButtonStyle(1)]}>
                    <TouchableOpacity
                        style={[styles.subButton, { backgroundColor: colors.surface }]}
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('AudioToText');
                        }}
                    >
                        <Text style={styles.subButtonIcon}>🎙️</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Add Button (Manual Entry) */}
                <Animated.View style={[styles.buttonWrapper, getButtonStyle(0)]}>
                    <TouchableOpacity
                        style={[styles.subButton, { backgroundColor: colors.surface }]}
                        onPress={() => {
                            closeMenu();
                            navigation.navigate('AddJournal');
                        }}
                    >
                        <Text style={styles.subButtonIcon}>✏️</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Main Toggle Button */}
                <TouchableOpacity
                    style={styles.mainButton}
                    onPress={toggleMenu}
                    activeOpacity={0.9}
                >
                    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                        {isExpanded ? (
                            <Text style={styles.mainButtonIcon}>+</Text>
                        ) : (
                            <View style={styles.logoContainer}>
                                <Text style={styles.logoText}>E</Text>
                            </View>
                        )}
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    menuContainer: {
        position: 'absolute',
        bottom: spacing.xl,
        right: spacing.xl,
        alignItems: 'center',
    },
    buttonWrapper: {
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.soft,
        zIndex: 10,
        borderWidth: 3,
        borderColor: colors.surfaceSoft,
    },
    logoContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    logoText: {
        fontFamily: typography.fontFamilyPrimary,
        fontSize: 28,
        fontWeight: '800',
        color: colors.surfaceSoft, // Beige text on Lilac background
        includeFontPadding: false,
    },
    mainButtonIcon: {
        fontFamily: typography.fontFamilyPrimary,
        fontSize: 36,
        color: colors.surfaceSoft,
        lineHeight: 40,
    },
    subButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.soft,
    },
    subButtonIcon: {
        fontSize: 22,
    },
});
>>>>>>> 7a2e35221d0f276e0a91014c905b43ddbc96f46b
