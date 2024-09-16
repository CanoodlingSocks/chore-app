import React from 'react';
import { Appbar, Menu, useTheme } from 'react-native-paper';
import { useUser } from '../utils/UserContext';

const HeaderMenu = ({ navigation }) => {
  const { userId } = useUser();
  const [menuVisible, setMenuVisible] = React.useState(false);
  const theme = useTheme();

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  
  const changeUser = () => {
    navigation.navigate('Avatar');
    closeMenu();
  };

  const navigateAddChoreScreen = () => {
    navigation.navigate('AddChore')
    closeMenu(); 
  };

  const headerStyle = {
    backgroundColor: userId === 1 ? '#4d6d7e' : '#e8831b',
  };

  const titleStyle = {
    color: 'white',
  };

  return (
    <>
      <Appbar.Header style={headerStyle}>
        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={<Appbar.Action icon="menu" style={{ backgroundColor: 'white' }} onPress={openMenu} />}
        >
          <Menu.Item onPress={changeUser} title="Change User" />
          <Menu.Item onPress={navigateAddChoreScreen} title="Add Chore" />
        </Menu>
        <Appbar.Content titleStyle={titleStyle} title="Chore Overview" />
      </Appbar.Header>
    </>
  );
};

export default HeaderMenu;