import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const iconNames = {
    'حل شدہ': 'book',
    "ترکیب": 'list-alt',
    "اسباق": 'pencil-square-o',
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

        const iconName = iconNames[label];

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={[
              styles.tab,
              {
                borderTopColor: isFocused ? '#0a8a06' : 'transparent',
                borderTopWidth: isFocused ? 3 : 0,
                marginBottom: isFocused ? 3 : 0,
              },
            ]}
          >
            <FontAwesome name={iconName} size={24} color={isFocused ? '#0a8a06' : 'gray'} />
            <Text style={{ color: isFocused ? '#0a8a06' : 'gray', fontSize: 18, textAlign: "right", fontFamily: 'JameelNoori', marginTop: -10  }}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'white', // Background color of the tab bar
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
});

export default CustomTabBar;
