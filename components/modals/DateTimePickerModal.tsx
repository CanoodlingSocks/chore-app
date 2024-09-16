import React, { useState } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

const DateTimePickerModal = ({ isVisible, onValueChange, onCancel }) => {
  const [value, setValue] = useState(dayjs());

  const handleConfirm = () => {
    onValueChange(value.toDate());
  };

  const handleCancel = () => {
    onCancel();
  };

    
  return (
    <Modal visible={isVisible} transparent animationType="slide" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <DateTimePicker
            value={value}
            onValueChange={(date) => setValue(dayjs(date))}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

type DateTimePickerModalProps = {
  isVisible: boolean,
  onValueChange: (date: Date) => void;
  onCancel: () => void;
};

DateTimePickerModal.defaultProps = {
  mode: 'datetime',
  locale: 'en',
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'blue',
    fontSize: 18,
  },
});

export default DateTimePickerModal;