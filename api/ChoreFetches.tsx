import axios from 'axios';
import moment from 'moment';
import { AgendaItem } from '../interfaces/IAgendaItem';
import { instance } from '../utils/Instance';

const api = axios.create({
  baseURL: instance,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loadItems = async (
  day: any,
  setItems: React.Dispatch<React.SetStateAction<{ [key: string]: AgendaItem[] }>>
) => {
  try {
    const incompleteResponse = await api.get('/Chore/incomplete', {
      params: {
        date: moment(day.timestamp).format('YYYY-MM-DD'),
      },
      timeout: 5000,
    });

    if (!incompleteResponse.data) {
      throw new Error('Failed to fetch incomplete chores');
    }

    const incompleteChores: AgendaItem[] = incompleteResponse.data.map((chore: any) => ({
      choreId: chore.choreId,
      name: chore.choreName,
      height: 50,
      day: moment(chore.deadline).format('YYYY-MM-DD'),
      isOverdue: false,
      assignedUser: chore.assignedUser ? chore.assignedUser.username : null,
    }));

    const overdueResponse = await api.get('/Chore/overdue');

    if (!overdueResponse.data) {
      throw new Error('Failed to fetch overdue chores');
    }

    const overdueChores: AgendaItem[] = overdueResponse.data.map((chore: any) => ({
      choreId: chore.choreId,
      name: chore.choreName,
      height: 50,
      day: moment().format('YYYY-MM-DD'), // Overdue chores are duplicated to today
      isOverdue: true,
      assignedUser: chore.assignedUser,
    }));

    // Merge incomplete and overdue chores
    const allItems: AgendaItem[] = [...incompleteChores, ...overdueChores];
    const items: { [key: string]: AgendaItem[] } = {};
    allItems.forEach((chore) => {
      const strTime = chore.day;
      if (!items[strTime]) {
        items[strTime] = [];
      }
      items[strTime].push(chore);
    });

    setItems(items);
  } catch (error) {
    console.error('Error fetching chores:', error);
  }
};

export const loadIncompleteChoreList = async () => {
  try {
    const response = await api.get('/Chore/incomplete');
    const incompleteChores = response.data.map((chore: any) => ({
      choreId: chore.choreId,
      name: chore.choreName,
      deadline: moment(chore.deadline).format('YYYY-MM-DD'),
      assignedUser: chore.assignedUser ? chore.assignedUser.username : null,
    }));

    return incompleteChores;
  } catch (error) {
    console.error('Error fetching incomplete chores:', error);
    throw error;
  }
};

export const markChoreAsDone = async (choreId: number) => {
  try {
    await api.post(`/Chore/markAsDone/${choreId}`);
  } catch (error) {
    console.error('Error marking chore as done:', error);
  }
};

export const deleteChore = async (choreId: number) => {
  try {
    await api.delete(`/Chore/${choreId}`);
  } catch (error) {
    console.error('Error deleting chore:', error);
  }
};

export const AddChoreFetch = async (choreData) => {
  try {
    const response = await api.post('/Chore/', choreData);

    if (!response.data) {
      throw new Error('Failed to add chore');
    }

    return response.data;
  } catch (error) {
    console.error('Error adding chore:', error);
    throw error.response.data;
  }
};

export const EditChoreFetch = async (choreId, choreData) => {
  try {
    const payload = {
      choreName: choreData.ChoreName,
      choreDescription: choreData.ChoreDescription,
      priorityLevel: mapPriorityLevelToEnum(choreData.PriorityLevel),
      isRecurring: choreData.IsRecurring,
      deadline: choreData.Deadline.toISOString(),
      lastUpdated: new Date().toISOString(),
      assignedUserId: choreData.AssignedUserId,
      categoryId: choreData.CategoryId,
    };

    const response = await api.put(`/Chore/editChore/${choreId}`, payload);

    if (!response.data) {
      throw new Error('Failed to edit chore');
    }

    return response.data;
  } catch (error) {
    console.error('Error editing chore:', error);
    throw error.response.data;
  }
};

export const FetchChoreById = async (choreId) => {
  try {
    const response = await api.get(`/Chore/get-chore/${choreId}`);

    if (!response.data) {
      throw new Error('Failed to get chore by id');
    }

    return response.data;
  } catch (error) {
    console.error('Error getting chore by id: ', error)
  }
}

const mapPriorityLevelToEnum = (priorityLevel) => {

  switch (priorityLevel) {
    case 'Low': return 0;
    case 'Medium': return 1;
    case 'High': return 2;
    default: return 0; 
  }
};