import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  className?: string;
  textClassName?: string;
  isLoading?: boolean;
  uppercase?: boolean;
}

export default function Button({
  title,
  onPress,
  className = '',
  textClassName = '',
  disabled = false,
  isLoading = false,
  activeOpacity = 0.8,
  uppercase = true,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={activeOpacity}
      className={`w-full max-w-[320px] bg-whatsapp-lightGreen py-3 px-6 rounded-sm items-center justify-center shadow-sm ${
        disabled ? 'opacity-50' : ''
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <Text
          className={`text-white font-bold text-sm text-center ${
            uppercase ? 'uppercase' : ''
          } ${textClassName}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
