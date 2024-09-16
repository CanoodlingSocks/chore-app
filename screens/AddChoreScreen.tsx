import React, { useState } from 'react';
import {
  TextInput,
  Switch,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useUser } from '../utils/UserContext';
import { AddChoreFetch } from '../api/ChoreFetches';
import DateTimePickerModal from '../components/modals/DateTimePickerModal';

enum PriorityLevel {
  "Low",
  "Medium",
  "High"
}

const AddChoreScreen = ({ navigation }) => {
  const { userId } = useUser();
  const [choreName, setChoreName] = useState<string>('');
  const [choreDescription, setChoreDescription] = useState<string>('');
  const [priorityLevel, setPriorityLevel] = useState<PriorityLevel>(PriorityLevel.Low);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [assignedUser, setAssignedUser] = useState(null);
  const [deadline, setDeadline] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([
    { label: 'Category 1', value: '1' },
    { label: 'Category 2', value: '2' },
    { label: 'None', value: null },
  ]);

  const handleConfirm = async () => {
    try {
      const now = new Date();
      const notCompleted = false; //This prop needed to be added

      const choreData = {
        ChoreName: choreName,
        ChoreDescription: choreDescription,
        PriorityLevel: priorityLevel,
        IsRecurring: isRecurring,
        CategoryId: category,
        CreatedByUserId: userId,
        AssignedUserId: assignedUser,
        Deadline: deadline,
        Created: now,
        IsCompleted: notCompleted,
      };

      console.log(choreData);
      await AddChoreFetch(choreData);
        onChoreAdded();
    } catch (error) {
      console.error('Error adding chore: ', error);
    }
  };

  const handleCancel = () => {
    onChoreAdded();
  };

  const handleRemoveAssignment = () => {
    setAssignedUser(null);
  };

  const onChoreAdded = () => {
    navigation.goBack({
      params: { choreAdded: true },
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
        <Text style={styles.modalTitle}>Add Chore</Text>
        <View style={[styles.modalContent]}>
          <TextInput
            style={[styles.input, { borderRadius: 8 }]}
            placeholder="Chore Name"
            value={choreName}
            onChangeText={(text) => setChoreName(text)}
            />
          <TextInput
            style={[styles.input, { borderRadius: 8 }]}
            placeholder="Chore Description (optional)"
            value={choreDescription}
            onChangeText={(text) => setChoreDescription(text)}
            />
          <DropDownPicker
            open={open}
            value={category}
            items={categories}
            setOpen={setOpen}
            setValue={setCategory}
            setItems={setCategories}
            placeholder='Select Category'
            containerStyle={{ marginBottom: 10 }}
            />

          <View style={styles.switchContainer}>
            <Text style={[styles.label, { fontWeight: 'bold' }]}>Chore is recurring?</Text>
            <Switch
              value={isRecurring}
              onValueChange={(value) => setIsRecurring(value)}
              />
          </View>

          <TouchableOpacity onPress={() => setIsVisible(true)}>
          <Text style={[styles.buttonText, { fontWeight: 'bold' }]}>{`Select Deadline`}</Text>
            <View style={[styles.datePickerButton, { backgroundColor: 'lightblue' }]}>
              <Text style={[styles.buttonText]}>{`${deadline.toLocaleString()}`}</Text>
            </View>
          </TouchableOpacity>

<DateTimePickerModal
  isVisible={isVisible}
  onValueChange={(date) => {
    setDeadline(date);
    setIsVisible(false);
  }}
  onCancel={() => setIsVisible(false)} 
/>

          <Text style={[styles.label, { fontWeight: 'bold', textAlign: 'center', marginTop: 10, fontSize: 20, }]}>Assign this chore to:</Text>
          <View style={styles.assignContainer}>
            <TouchableOpacity
              style={[styles.assignButton, assignedUser === 1 && styles.selectedButton, {backgroundColor: '#4d6d7e'}]}
              onPress={() => setAssignedUser(1)}
              >
              <Text style={styles.userButtonText}>Lela</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.assignButton, assignedUser === 2 && styles.selectedButton, {backgroundColor: '#e8831b'}]}
              onPress={() => setAssignedUser(2)}
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
            <Pressable
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: pressed ? '#febab8' : 'coral' },
              ]}
              onPress={handleCancel}
              >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: pressed ? '#d6efef' : 'lightblue' },
              ]}
              onPress={handleConfirm}
              >
              <Text style={styles.buttonText}>Confirm</Text>
            </Pressable>
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
  modalTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
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
  buttonText: {
    color: 'black',
    textAlign: 'center'
  },
  userButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
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

export default AddChoreScreen;