import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { ParsedWork, WorkStatus, User, TransactionState, Notification } from '@/types';
import { isMockMode } from '@/config/development';
import { MOCK_WORKS, MOCK_USDC_BALANCE, MOCK_USER_ADDRESS } from '@/lib/mocks/mockData';

interface AppState {
  // User data
  user: User | null;
  usdcBalance: string;
  
  // Works data
  works: ParsedWork[];
  userWorks: ParsedWork[];
  isLoadingWorks: boolean;
  
  // Transaction states
  transactionStates: Record<string, TransactionState>;
  
  // UI state
  notifications: Notification[];
  
  // Filters and search
  workFilter: {
    status?: WorkStatus[];
    role?: 'client' | 'worker' | 'all';
    search?: string;
  };
  
  // Actions
  setUser: (user: User | null) => void;
  setUSDCBalance: (balance: string) => void;
  setWorks: (works: ParsedWork[]) => void;
  setUserWorks: (works: ParsedWork[]) => void;
  setIsLoadingWorks: (loading: boolean) => void;
  addWork: (work: ParsedWork) => void;
  updateWork: (workId: number, updates: Partial<ParsedWork>) => void;
  removeWork: (workId: number) => void;
  
  // Transaction state management
  setTransactionState: (key: string, state: TransactionState) => void;
  clearTransactionState: (key: string) => void;
  
  // Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Filters
  setWorkFilter: (filter: Partial<AppState['workFilter']>) => void;
  clearWorkFilter: () => void;
  
  // Reset store
  reset: () => void;
  
  // Auth actions
  logout: () => void;
}

const getInitialState = () => {
  const baseState = {
    user: null,
    usdcBalance: '0',
    works: [],
    userWorks: [],
    isLoadingWorks: false,
    transactionStates: {},
    notifications: [],
    workFilter: {
      role: 'all' as const,
    },
  };

  // Only populate mock data on client side to prevent hydration mismatch
  // Don't auto-connect user - let them see the landing page first
  if (typeof window !== 'undefined' && isMockMode()) {
    return {
      ...baseState,
      usdcBalance: MOCK_USDC_BALANCE.replace(',', ''),
      works: MOCK_WORKS,
      userWorks: MOCK_WORKS.filter(work => 
        work.client.toLowerCase() === MOCK_USER_ADDRESS.toLowerCase() ||
        work.worker.toLowerCase() === MOCK_USER_ADDRESS.toLowerCase()
      ),
    };
  }

  return baseState;
};

const initialState = getInitialState();

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // User actions  
        setUser: (user) => set((state) => {
          // Only update if user actually changed
          if (JSON.stringify(state.user) !== JSON.stringify(user)) {
            return { user };
          }
          return state;
        }, false, 'setUser'),
        
        setUSDCBalance: (balance) => set({ usdcBalance: balance }, false, 'setUSDCBalance'),

        // Works actions
        setWorks: (works) => set({ works }, false, 'setWorks'),
        
        setUserWorks: (userWorks) => set({ userWorks }, false, 'setUserWorks'),
        
        setIsLoadingWorks: (loading) => set({ isLoadingWorks: loading }, false, 'setIsLoadingWorks'),
        
        addWork: (work) => set(
          (state) => ({
            works: [work, ...state.works],
            userWorks: state.user && (
              work.client.toLowerCase() === state.user.address.toLowerCase() ||
              work.worker.toLowerCase() === state.user.address.toLowerCase()
            ) ? [work, ...state.userWorks] : state.userWorks,
          }),
          false,
          'addWork'
        ),
        
        updateWork: (workId, updates) => set(
          (state) => ({
            works: state.works.map(work => 
              work.id === workId ? { ...work, ...updates } : work
            ),
            userWorks: state.userWorks.map(work => 
              work.id === workId ? { ...work, ...updates } : work
            ),
          }),
          false,
          'updateWork'
        ),
        
        removeWork: (workId) => set(
          (state) => ({
            works: state.works.filter(work => work.id !== workId),
            userWorks: state.userWorks.filter(work => work.id !== workId),
          }),
          false,
          'removeWork'
        ),

        // Transaction state management
        setTransactionState: (key, transactionState) => set(
          (state) => ({
            transactionStates: {
              ...state.transactionStates,
              [key]: transactionState,
            },
          }),
          false,
          'setTransactionState'
        ),
        
        clearTransactionState: (key) => set(
          (state) => {
            const { [key]: removed, ...rest } = state.transactionStates;
            return { transactionStates: rest };
          },
          false,
          'clearTransactionState'
        ),

        // Notifications
        addNotification: (notification) => {
          const id = Math.random().toString(36).substring(2) + Date.now().toString(36);
          const newNotification: Notification = {
            ...notification,
            id,
            timestamp: Date.now(),
          };
          
          set(
            (state) => ({
              notifications: [newNotification, ...state.notifications],
            }),
            false,
            'addNotification'
          );
          
          // Auto-remove notification after 5 seconds if autoHide is true
          if (notification.autoHide !== false) {
            setTimeout(() => {
              get().removeNotification(id);
            }, 5000);
          }
        },
        
        removeNotification: (id) => set(
          (state) => ({
            notifications: state.notifications.filter(n => n.id !== id),
          }),
          false,
          'removeNotification'
        ),
        
        clearNotifications: () => set({ notifications: [] }, false, 'clearNotifications'),

        // Filters
        setWorkFilter: (filter) => set(
          (state) => ({
            workFilter: { ...state.workFilter, ...filter },
          }),
          false,
          'setWorkFilter'
        ),
        
        clearWorkFilter: () => set(
          { workFilter: { role: 'all' } },
          false,
          'clearWorkFilter'
        ),

        // Reset store
        reset: () => set(initialState, false, 'reset'),
        
        // Auth actions
        logout: () => set({
          user: null,
          usdcBalance: '0',
          works: [],
          userWorks: [],
          transactionStates: {},
          notifications: [],
        }, false, 'logout'),
      }),
      {
        name: 'workescrow-app-store',
        partialize: (state) => ({
          // Only persist user preferences and non-sensitive data
          workFilter: state.workFilter,
        }),
      }
    ),
    {
      name: 'WorkEscrow App Store',
    }
  )
);

// Computed selectors
export const useFilteredWorks = () => {
  const { works, workFilter, user } = useAppStore();
  
  return works.filter(work => {
    // Role filter
    if (workFilter.role === 'client' && user) {
      if (work.client.toLowerCase() !== user.address.toLowerCase()) return false;
    } else if (workFilter.role === 'worker' && user) {
      if (work.worker.toLowerCase() !== user.address.toLowerCase()) return false;
    }
    
    // Status filter
    if (workFilter.status && workFilter.status.length > 0) {
      if (!workFilter.status.includes(work.status)) return false;
    }
    
    // Search filter
    if (workFilter.search) {
      const search = workFilter.search.toLowerCase();
      if (
        !work.title.toLowerCase().includes(search) &&
        !work.description.toLowerCase().includes(search)
      ) {
        return false;
      }
    }
    
    return true;
  });
};

// Transaction state helpers
export const useTransactionState = (key: string) => {
  const transactionStates = useAppStore(state => state.transactionStates);
  return transactionStates[key] || { isLoading: false };
};

export const useIsAnyTransactionLoading = () => {
  const transactionStates = useAppStore(state => state.transactionStates);
  return Object.values(transactionStates).some(state => state.isLoading);
};
