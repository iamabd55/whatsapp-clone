import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-whatsapp-darkBackground">
            <View className="flex-1 p-4">
                <Text className="text-2xl pl-3 font-extrabold text-whatsapp-green dark:text-whatsapp-white">
                    WhatsApp
                </Text>
            </View>
        </SafeAreaView>
    );
};

export default Home;
