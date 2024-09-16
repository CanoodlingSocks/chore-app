import * as React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
import { ChoreListItemProps } from '../utils/ChoreListTypes';
import { getAssignButtonColor } from '../utils/colors';

export const ChoreListItem = React.memo<ChoreListItemProps>(({ item, onPress }) => {
    return (
      <TouchableOpacity
        style={styles.choreItemContainer}
        onPress={() => onPress(item)}
      >
        <View style={styles.choreItemHeader}>
          <Text style={styles.choreItemTitle}>{item.name}</Text>
          <Text>Deadline: {item.deadline}</Text>
        </View>
        {item.assignedUser && (
          <View style={styles.choreItemFooter}>
            <TouchableOpacity
              style={[
                styles.assignButton,
                styles.selectedButton,
                { backgroundColor: getAssignButtonColor(item.assignedUser) },
              ]}
              onPress={() => {}}
            >
              <Text style={styles.userButtonText}>{item.assignedUser}</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  });
  
const styles = StyleSheet.create({
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
    choreListTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      marginTop: 10,
      textAlign: 'center',
    },
    choreItemContainer: {
      backgroundColor: 'white',
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
    },
    choreItemHeader: {
      marginBottom: 5,
    },
    choreItemTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    choreItemFooter: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  });  

export default ChoreListItem;