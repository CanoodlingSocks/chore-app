import React from 'react';
import { Modal, Text, View, TouchableOpacity, Pressable } from 'react-native';
import * as ChoreFetches from '../../api/ChoreFetches';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ChoreDetailsModal = ({ choreData, isVisible, onClose }) => {
  const [choreInfo, setChoreInfo] = useState(null);

  useEffect(() => {
    const fetchChoreDetails = async () => {
      if (isVisible && choreData) {
        try {
          const response = await ChoreFetches.FetchChoreById(choreData.choreId);
          if (response) {
            setChoreInfo(response);
          } else {
            console.error('No chore with the id', choreData.choreId, 'could be found');
          }
        } catch (error) {
          console.error('Error fetching chore details:', error);
        }
      }
    };

    fetchChoreDetails();
  }, [isVisible, choreData]);

  const formatDeadline = (deadline) => {
    return moment(deadline).format('HH:mm, dddd, Do MMM YYYY');
  };

  const handleOnPress = () => {
    //Add fetch for taking a chore
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}
        onPress={onClose}
      >
        <Pressable
          style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}
          onPress={() => { }} 
        >
          {choreInfo ? (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 3 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{choreInfo.choreName}</Text>

                {choreInfo.assignedUser && (
                  <Pressable
                    style={[
                      styles.assignButton,
                      styles.selectedButton,
                      choreInfo.assignedUser.username === 'Kevs'
                        ? { backgroundColor: '#e8831b' }
                        : choreInfo.assignedUser.username === 'Lela'
                          ? { backgroundColor: '#4d6d7e' }
                          : {},
                    ]}
                    onPress={() => { }}
                  >
                    <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                      {choreInfo.assignedUser.username}
                    </Text>
                  </Pressable>
                )}
              </View>
              <Text>
                <View style={styles.descriptionContainer}>
                  <Text
                    numberOfLines={4}
                    ellipsizeMode="tail"
                  >
                    {choreInfo.choreDescription ? choreInfo.choreDescription : 'This chore has no description'}
                  </Text>
                </View>
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontWeight: 'bold' }}>Created by:</Text>
                <Text style={{ marginRight: 160, }}>{choreInfo.createdByUser?.username}</Text>
              </View>
              <Text style={{ fontWeight: 'bold' }}>Deadline: {formatDeadline(choreInfo.deadline)}</Text>

              {!choreInfo.assignedUser && (
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#61ab7a',
                      padding: 10,
                      borderRadius: 5,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                    onPress={handleOnPress}
                  >
                    <MaterialCommunityIcons name="arm-flex" size={24} color="white" />
                    <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 5 }}>I got it!</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <Text>Loading chore details...</Text>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = {
  assignButton: {
    padding: 7,
    borderRadius: 5,
    width: 60,
  },
  selectedButton: {
    elevation: 4,
  },
  userButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  descriptionContainer: {
    maxWidth: 270,
    paddingBottom: 8,
    paddingTop: 5,
  },
};

export default ChoreDetailsModal;