import { Stack } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
  // Las pantallas dentro de app/(tabs)/admin/* serán parte de este Stack
  return <Stack screenOptions={{ headerShown: false }} />;
}