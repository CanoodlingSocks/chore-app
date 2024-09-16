import React, { useState, useEffect } from 'react';
import {
  TextInput,
  Switch,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from '../components/modals/DateTimePickerModal';
import { EditChoreFetch, FetchChoreById } from '../api/ChoreFetches';
import { useUser } from '../utils/UserContext';

enum PriorityLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

const EditChoreScreen = ({ navigation, route }) => {
  const { userId } = useUser();
  const { choreId } = route.params;

    const [fetchedChoreData, setFetchedChoreData] = useState({
        ChoreName: '',
        ChoreDescription: '',
        PriorityLevel: PriorityLevel.Low,
        IsRecurring: false,
        CategoryId: null,
        Deadline: new Date(),
        AssignedUserId: null,
      });

  const [updatedChoreData, setUpdatedChoreData] = useState({
    ChoreName: '',
    ChoreDescription: '',
    PriorityLevel: PriorityLevel.Low,
    IsRecurring: false,
    CategoryId: null,
    Deadline: new Date(),
    AssignedUserId: null,
  });
    
  const [assignedUser, setAssignedUser] = useState(fetchedChoreData.AssignedUserId);

  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState([
    { label: 'Category 1', value: '1' },
    { label: 'Category 2', value: '2' },
    { label: 'None', value: null },
  ]);

  useEffect(() => {
    const fetchChoreData = async () => {
      try {
        const fetchedData = await FetchChoreById(choreId);
        if (fetchedData) {
          const chore = fetchedData;
          const deadline = chore.deadline ? new Date(chore.deadline) : new Date();
          setFetchedChoreData({
            ChoreName: chore.choreName,
            ChoreDescription: chore.choreDescription || '',
            PriorityLevel: chore.priorityLevel || PriorityLevel.Low,
            IsRecurring: chore.isRecurring || false,
            CategoryId: chore.categoryId || null,
            Deadline: deadline,
            AssignedUserId: chore.assignedUserId || null,
          });
          setUpdatedChoreData({
            ChoreName: chore.choreName,
            ChoreDescription: chore.choreDescription || '',
            PriorityLevel: chore.priorityLevel || PriorityLevel.Low,
            IsRecurring: chore.isRecurring || false,
            CategoryId: chore.categoryId || null,
            Deadline: deadline,
            AssignedUserId: chore.assignedUserId || null,
          });
          setAssignedUser(chore.assignedUserId || null);
        } else {
          console.error('No data returned for chore ID:', choreId);
        }
      } catch (error) {
        console.error('Error fetching chore data by ID:', error);
      }
    };

    fetchChoreData();
  }, [choreId]);


  const handleConfirm = async () => {
      try {
      console.log("Submitting chore data:", updatedChoreData);
      await EditChoreFetch(choreId, updatedChoreData);
      onChoreUpdated();
    } catch (error) {
      console.error('Error editing chore:', error);
    }
  };
  
  const handleCancel = () => {
    navigation.goBack();
    };
    
    const handleAssignUser = (userId) => {
        setAssignedUser(userId);
        setUpdatedChoreData(prevState => ({ ...prevState, AssignedUserId: userId }));
      };

    const handleRemoveAssignment = () => {
        setAssignedUser(null);
        setUpdatedChoreData(prevState => ({ ...prevState, AssignedUserId: null }));
      };

    const handleDateChange = (date) => {
      setUpdatedChoreData({ ...updatedChoreData, Deadline: date });
    setIsVisible(false);
  };
  
  const handleDateCancel = () => {
    setIsVisible(false);
  };

  const onChoreUpdated = () => {
    navigation.goBack({
      params: { choreUpdated: true },
      merge: true,
    });
  };

  return (
    <KeyboardAvoidingView
    style={[styles.container, { backgroundColor: userId === 1 ? '#4d6d7e' : '#e8831b' }]}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Chore</Text>
          <View style={[styles.modalContent]}>
          <TextInput
              style={[styles.input, {borderRadius: 8 }]}
              placeholder={fetchedChoreData.ChoreName}
              value={updatedChoreData.ChoreName || fetchedChoreData.ChoreName}
              onChangeText={(text) =>
                setUpdatedChoreData({ ...updatedChoreData, ChoreName: text })
              }
              />
            <TextInput
              style={[styles.input, { borderRadius: 8 }]}
              placeholder={fetchedChoreData.ChoreDescription === "" ? "Chore Description (optional)" : fetchedChoreData.ChoreDescription}
              value={updatedChoreData.ChoreDescription}
              onChangeText={(text) =>
                setUpdatedChoreData({ ...updatedChoreData, ChoreDescription: text })
              }
              />
            <DropDownPicker
              open={open}
              value={fetchedChoreData.CategoryId}
              items={categories}
              setOpen={setOpen}
              setValue={(value) =>
                setUpdatedChoreData({ ...updatedChoreData, CategoryId: value })
              }
              setItems={setCategories}
              placeholder={fetchedChoreData.CategoryId} 
              containerStyle={{ marginBottom: 10 }}
              />

            <View style={styles.switchContainer}>
              <Text style={[styles.label, { fontWeight: 'bold' }]}>Chore is recurring?</Text>
              <Switch
                value={fetchedChoreData.IsRecurring}
                onValueChange={(value) =>
                  setUpdatedChoreData({ ...updatedChoreData, IsRecurring: value })
                }
                />
            </View>

            <TouchableOpacity onPress={() => setIsVisible(true)}>
              <Text style={[styles.buttonText, { fontWeight: 'bold' }]}>Select Deadline</Text>
              <View style={[styles.datePickerButton, { backgroundColor: 'lightblue' }]}>
              <Text style={[styles.buttonText]}>
  {`${updatedChoreData.Deadline.toLocaleString()}`}
</Text>
              </View>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isVisible}
              onValueChange={handleDateChange}
              onCancel={handleDateCancel}
              />
                      
                      <Text style={[styles.label, { fontWeight: 'bold', textAlign: 'center', marginTop: 10, fontSize: 20, }]}>Assign this chore to:</Text>
          <View style={styles.assignContainer}>
            <TouchableOpacity
              style={[styles.assignButton, assignedUser === 1 && styles.selectedButton, {backgroundColor: '#4d6d7e'}]}
              onPress={() => handleAssignUser(1)}
              >
              <Text style={styles.userButtonText}>Lela</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.assignButton, assignedUser === 2 && styles.selectedButton, {backgroundColor: '#e8831b'}]}
              onPress={() => handleAssignUser(2)}
              >
              <Text style={styles.userButtonText}>Kevs</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { fontWeight: 'bold', textAlign: 'center', marginTop: 10, fontSize: 20 }]}>
            {assignedUser ? `This chore has been assigned to ${assignedUser === 1 ? 'Lela' : 'Kevs'}!` : ''}
          </Text>
          
          {assignedUser && (
            <TouchableOpacity onPress={handleRemoveAssignment} style={styles.removeAssignmentButton}>
              <Text style={styles.removeAssignmentButtonText}>Remove Assignment</Text>
            </TouchableOpacity>
          )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'coral' }]}
                onPress={handleCancel}
                >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'lightblue' }]}
                onPress={handleConfirm}
                >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
</ScrollView>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  modalContainer: {
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  label: {
    marginBottom: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  datePickerButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    margin: 5,
    alignItems: 'center',
    },
  assignContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: '#d6efef',
    paddingBottom: 10,
    borderRadius: 8,
  },
  assignButton: {
    margin: 10,
    height: 50,
    width: 90,
    padding: 10,
    justifyContent: 'center',
    marginBottom: 0,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  selectedButton: {
    backgroundColor: 'blue',
  },
  userButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  removeAssignmentButton: {
    backgroundColor: 'coral',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  removeAssignmentButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditChoreScreen;