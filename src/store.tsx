import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ListCategory, ListItem, ListRecord, UserPreferences } from './types';
import {
  DEFAULT_PREFERENCES,
  INITIAL_DEMO_LISTS,
  loadStoredLists,
  loadStoredPreferences,
  saveStoredLists,
  saveStoredPreferences,
} from './storage';

interface ListContextValue {
  lists: ListRecord[];
  isLoading: boolean;
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  addList: (name: string, category: ListCategory) => string;
  updateList: (id: string, name: string, category: ListCategory) => void;
  deleteList: (id: string) => void;
  addItem: (listId: string, name: string, quantity: number) => string;
  toggleItem: (listId: string, itemId: string) => void;
  editItem: (listId: string, itemId: string, name: string, quantity: number) => void;
  deleteItem: (listId: string, itemId: string) => void;
  clearCompleted: (listId: string) => void;
  resetToDemoData: () => void;
  clearAllData: () => void;
}

const ListContext = createContext<ListContextValue | null>(null);

const makeId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;

export function ListProvider({ children }: { children: React.ReactNode }) {
  const [lists, setLists] = useState<ListRecord[]>(INITIAL_DEMO_LISTS);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cargar datos locales al iniciar
  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const [savedLists, savedPrefs] = await Promise.all([
          loadStoredLists(),
          loadStoredPreferences(),
        ]);
        if (isMounted) {
          setLists(savedLists);
          setPreferences(savedPrefs);
          setIsLoading(false);
        }
      } catch (e) {
        console.warn('[Listly] Error inicializando estado:', e);
        if (isMounted) setIsLoading(false);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  // Guardar listas cuando cambien
  const updateListsAndPersist = (updater: (prev: ListRecord[]) => ListRecord[]) => {
    setLists(prev => {
      const next = updater(prev);
      saveStoredLists(next);
      return next;
    });
  };

  const updatePreferences = (partial: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const next = { ...prev, ...partial };
      saveStoredPreferences(next);
      return next;
    });
  };

  const addList = (name: string, category: ListCategory): string => {
    const id = makeId('list');
    const newList: ListRecord = {
      id,
      name: name.trim(),
      category,
      createdAt: new Date().toISOString(),
      items: [],
    };
    updateListsAndPersist(prev => [newList, ...prev]);
    return id;
  };

  const updateList = (id: string, name: string, category: ListCategory): void => {
    updateListsAndPersist(prev =>
      prev.map(list =>
        list.id === id ? { ...list, name: name.trim(), category } : list
      )
    );
  };

  const deleteList = (id: string): void => {
    updateListsAndPersist(prev => prev.filter(list => list.id !== id));
  };

  const addItem = (listId: string, name: string, quantity: number): string => {
    const newItemId = makeId('item');
    const safeQty = Math.max(1, Math.floor(quantity) || 1);
    const newItem: ListItem = {
      id: newItemId,
      name: name.trim(),
      quantity: safeQty,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    updateListsAndPersist(prev =>
      prev.map(list =>
        list.id === listId
          ? {
              ...list,
              items: [...list.items, newItem],
            }
          : list
      )
    );
    return newItemId;
  };

  const toggleItem = (listId: string, itemId: string): void => {
    const nowIso = new Date().toISOString();
    updateListsAndPersist(prev =>
      prev.map(list => {
        if (list.id !== listId) return list;
        return {
          ...list,
          items: list.items.map(item => {
            if (item.id !== itemId) return item;
            const willBeCompleted = !item.completed;
            return {
              ...item,
              completed: willBeCompleted,
              completedAt: willBeCompleted ? nowIso : null,
            };
          }),
        };
      })
    );
  };

  const editItem = (listId: string, itemId: string, name: string, quantity: number): void => {
    const safeQty = Math.max(1, Math.floor(quantity) || 1);
    updateListsAndPersist(prev =>
      prev.map(list => {
        if (list.id !== listId) return list;
        return {
          ...list,
          items: list.items.map(item =>
            item.id === itemId
              ? { ...item, name: name.trim(), quantity: safeQty }
              : item
          ),
        };
      })
    );
  };

  const deleteItem = (listId: string, itemId: string): void => {
    updateListsAndPersist(prev =>
      prev.map(list => {
        if (list.id !== listId) return list;
        return {
          ...list,
          items: list.items.filter(item => item.id !== itemId),
        };
      })
    );
  };

  const clearCompleted = (listId: string): void => {
    updateListsAndPersist(prev =>
      prev.map(list => {
        if (list.id !== listId) return list;
        return {
          ...list,
          items: list.items.filter(item => !item.completed),
        };
      })
    );
  };

  const resetToDemoData = (): void => {
    updateListsAndPersist(() => INITIAL_DEMO_LISTS);
  };

  const clearAllData = (): void => {
    updateListsAndPersist(() => []);
  };

  const value = useMemo<ListContextValue>(
    () => ({
      lists,
      isLoading,
      preferences,
      updatePreferences,
      addList,
      updateList,
      deleteList,
      addItem,
      toggleItem,
      editItem,
      deleteItem,
      clearCompleted,
      resetToDemoData,
      clearAllData,
    }),
    [lists, isLoading, preferences]
  );

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
}

export function useLists(): ListContextValue {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error('useLists debe utilizarse dentro de un ListProvider');
  }
  return context;
}
export * from './types';