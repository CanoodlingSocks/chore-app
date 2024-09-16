import { useState, useCallback } from 'react';
import { loadItems, markChoreAsDone, deleteChore, loadIncompleteChoreList } from '../api/ChoreFetches';
import { AgendaItem } from '../interfaces/IAgendaItem';

const useChores = () => {
  const [items, setItems] = useState<{ [key: string]: AgendaItem[] }>({});
  const [choresList, setChoresList] = useState<AgendaItem[]>([]);

  const fetchItems = useCallback((timestamp: number) => {
    loadItems({ timestamp }, setItems);
  }, []);

  const fetchIncompleteChores = useCallback(() => {
    loadIncompleteChoreList()
      .then(setChoresList)
      .catch(error => console.error('Error loading incomplete chores:', error));
  }, []);

  const markChoreDone = useCallback(async (choreId: number) => {
    await markChoreAsDone(choreId);
    fetchItems(new Date().getTime());
  }, [fetchItems]);

  const removeChore = useCallback(async (choreId: number) => {
    await deleteChore(choreId);
    fetchItems(new Date().getTime()); 
  }, [fetchItems]);

  return { items, choresList, fetchItems, fetchIncompleteChores, markChoreDone, removeChore };
};

export default useChores;