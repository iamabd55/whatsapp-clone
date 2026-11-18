import React from 'react';
import { Redirect } from 'expo-router';

const Index = () => {
  return <Redirect href="/(auth)/terms_agree" />;
};

export default Index;
