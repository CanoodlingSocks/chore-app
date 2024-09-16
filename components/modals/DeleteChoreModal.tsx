import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteChoreModal: React.FC<Props> = ({ visible, onClose, onConfirm }) => (
  <Modal
    visible={visible}
    onRequestClose={onClose}
    transparent
    animationType="slide"
  >
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text>Are you sure you want to delete this chore?</Text>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </Card.Content>
        </Card>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  confirmButton: {
    backgroundColor: '#6896c3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'coral',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
      color: 'white',
      fontWeight: 'bold'
  },
});

export default DeleteChoreModal;