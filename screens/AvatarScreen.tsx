import React, { useEffect, useState } from 'react';
import { TouchableRipple, Text, useTheme } from 'react-native-paper';
import { useUser } from '../utils/UserContext';
import axios from 'axios';
import { View, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { instance } from '../utils/Instance';

interface User {
  userId: number;
  username: string;
}

type AvatarScreenProps = NativeStackScreenProps<RootStackParamList, 'ChoreOverview'>;
const AvatarScreen = ({ navigation }: AvatarScreenProps) => {
  const { updateUser } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${instance}/User`);

        if (!response.data) {
          throw new Error('Failed to fetch users');
        }

        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserPress = (userId: number) => {
    updateUser(userId);
    navigation.navigate('ChoreOverview');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/chorelove-logo.png')} style={styles.logo} />
      <View style={styles.buttonRow}>
        {users.map((user, index) => (
         <TouchableRipple
         key={user.userId}
         onPress={() => handleUserPress(user.userId)}
         style={[
           styles.button,
           {
             backgroundColor: index === 0 ? '#4d6d7e' : '#e8831b',
           },
         ]}
       >
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
           {index === 0 ? (
             <Icon name="user-female" size={20} color="white" style={styles.icon} />
           ) : (
             <Icon name="user" size={20} color="white" style={styles.icon} />
           )}
           <Text style={styles.buttonText}>{user.username}</Text>
         </View>
       </TouchableRipple>
       
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 25,
  },
  icon: {
    marginRight: 8,
  },
  logo: {
    width: 300,
    height: 110,
    marginBottom: 16,
  },
});

export default AvatarScreen;