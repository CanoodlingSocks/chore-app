import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, StatusBar, Text, Pressable, FlatList} from 'react-native';
import { Agenda } from 'react-native-calendars';
import { Card, Button, Provider } from 'react-native-paper';
import moment from 'moment';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DeleteChoreModal from '../components/modals/DeleteChoreModal';
import { AgendaItem } from '../interfaces/IAgendaItem';
import useChores from '../hooks/useChores';
import ChoreListItem from '../components/ChoreListItem';
import ChoreDetailsModal from '../components/modals/ChoreDetailsModal';

const ChoreOverview = ({ navigation }: NativeStackScreenProps<RootStackParamList, 'AvatarScreen'>) => {
  const { items, choresList, fetchItems, fetchIncompleteChores, markChoreDone, removeChore } = useChores();
  const [selectedChore, setSelectedChore] = useState<AgendaItem | null>(null);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);
  const [choreDetailsVisible, setChoreDetailsVisible] = useState(false);

  useEffect(() => {
    fetchItems(new Date().getTime());
    fetchIncompleteChores();
  }, [fetchItems, fetchIncompleteChores]);

  const handleEditPress = (chore) => {
    setSelectedChore(chore);
    navigation.navigate('EditChore', { choreId: chore.choreId });
  };

  const handleDeletePress = (chore) => {
    setSelectedChore(chore);
    setDeleteConfirmationVisible(true);
  };

  const handleDeleteConfirmationClose = async () => {
    if (selectedChore) {
      await removeChore(selectedChore.choreId);
      setSelectedChore(null);
      setDeleteConfirmationVisible(false);
      fetchItems(new Date().getTime()); 
    }
  };

  const handleMarkChoreAsDone = async (chore) => {
    const choreIdToMarkAsDone = chore.choreId;
    setSelectedChore(chore);
    await markChoreDone(choreIdToMarkAsDone);
    setSelectedChore(null);
    fetchItems(new Date().getTime()); 
  }

  const openChoreDetailsModal = (chore) => {
    setSelectedChore(chore);
    console.log("SelectedChore", chore)
    setChoreDetailsVisible(true);
  }
  
  const closeChoreDetailsModal = () => {
    setSelectedChore(null);
    setChoreDetailsVisible(false); 
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchItems(new Date().getTime());
    setRefreshing(false);
  }, [fetchItems]);

  const renderItem = (item: AgendaItem) => {
    const isOverdue = item.isOverdue;
    const isDuplicatedToToday = moment(item.day).isSame(moment().format('YYYY-MM-DD'));
  
    const itemStyle = {
      borderColor: isOverdue ? 'red' : 'transparent',
      borderWidth: 2,
      padding: 10,
      borderRadius: 5,
      marginTop: 17,
      backgroundColor: 'white',
    };
  
    return (
      <TouchableOpacity style={styles.item} onPress={() => openChoreDetailsModal(item)}>
        <Card style={itemStyle}>
          <Card.Content>
            <View style={styles.assignmentContainer}>
              {item.assignedUser === 'Kevs' && (
                <Pressable
                  style={[styles.assignButton, styles.selectedButton, { backgroundColor: '#e8831b' }]}
                  onPress={() => { }}
                >
                  <Text style={styles.userButtonText}>{item.assignedUser}</Text>
                </Pressable>
              )}
              {item.assignedUser === 'Lela' && (
                <Pressable
                  style={[styles.assignButton, styles.selectedButton, { backgroundColor: '#4d6d7e' }]}
                  onPress={() => { }}
                >
                  <Text style={styles.userButtonText}>{item.assignedUser}</Text>
                </Pressable>
              )}
            </View>
            <Text style={styles.nameText}>{item.name}</Text>
            {isOverdue && isDuplicatedToToday && (
              <Text style={{ color: 'red', fontStyle: 'italic' }}>
                This chore is overdue today
              </Text>
            )}
            <View style={styles.buttonContainer}>
              <Button icon="pencil" onPress={() => handleEditPress(item)}>
                Edit
              </Button>
              <Button icon="check" onPress={() => handleMarkChoreAsDone(item)}>
                Done
              </Button>
              <Button icon="delete" onPress={() => handleDeletePress(item)}>
                Delete
              </Button>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  }

  const renderChoresList = () => {
    if (choresList.length === 0) {
      return <View><Text style={styles.centerText}>No chores found</Text></View>;
    }

    return (
      <FlatList
        data={choresList}
        keyExtractor={(item) => item.choreId.toString()}
        renderItem={({ item }) => <ChoreListItem item={item} onPress={handleEditPress} />}
      />
    );
  };
  
  const handleLoadItemsForMonth = (data: { dateString: string }) => {
    const timestamp = moment(data.dateString).valueOf();
    fetchItems(timestamp);
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Agenda
          items={items}
          loadItemsForMonth={handleLoadItemsForMonth}
          selected={moment().format('YYYY-MM-DD')}
          renderItem={renderItem}
          renderEmptyData={renderChoresList}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
        />
        {deleteConfirmationVisible && (
          <DeleteChoreModal
            visible={deleteConfirmationVisible}
            onClose={() => setDeleteConfirmationVisible(false)}
            onConfirm={handleDeleteConfirmationClose}
          />
        )}
         <ChoreDetailsModal
     choreData={selectedChore}
    isVisible={choreDetailsVisible}
    onClose={closeChoreDetailsModal}
  />
        <StatusBar />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
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
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    paddingBottom: 5,
    paddingLeft: 5,
  },
  assignmentContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  centerText: {
    textAlign: 'center', 
    margin: 20
  }
});

export default ChoreOverview;