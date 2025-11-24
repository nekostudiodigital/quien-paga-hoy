import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Image } from 'react-native';


const icons = {
index: require('@/assets/images/icons/contact.png'),
historial: require('@/assets/images/icons/historial.png'),
admin: require('@/assets/images/icons/settings.png'),
};

function TabIcon({ routeName, color }: { routeName: string; color: string }) {
  return <Image source={icons[routeName]} style={{ width: 28, height: 28, tintColor: color }} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Contactos',
          headerShown: false,
          header: () => null,
          tabBarIcon: ({ color }) => <TabIcon routeName="index" color={color} />
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          headerShown: false,
          header: () => null,
          tabBarIcon: ({ color }) => <TabIcon routeName="historial" color={color} />
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Ajustes',
          headerShown: false,
          header: () => null,
          tabBarIcon: ({ color }) => <TabIcon routeName="admin" color={color} />
        }}
      />
    </Tabs>
  );
}
