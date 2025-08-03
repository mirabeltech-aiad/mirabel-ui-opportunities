/**
 * @fileoverview Context Factory Pattern
 * 
 * Factory for generating React contexts with standardized providers and hooks.
 * Reduces boilerplate and ensures consistent context implementation patterns.
 * 
 * @author Factory Team
 * @since 1.0.0
 */

import React, { createContext, useContext, useReducer, useMemo, ReactNode } from 'react';

/**
 * Base action interface
 */
export interface BaseAction {
  type: string;
  payload?: any;
}

/**
 * Configuration interface for context factory
 */
export interface ContextFactoryConfig<TState> {
  /** Display name for the context (used in React DevTools) */
  name: string;
  /** Initial state for the context */
  initialState: TState;
  /** Reducer function */
  reducer: (state: TState, action: BaseAction) => TState;
}

/**
 * Context value interface
 */
export interface ContextValue<TState> {
  /** Current state */
  state: TState;
  /** Raw dispatch function */
  dispatch: React.Dispatch<BaseAction>;
}

/**
 * Provider component props
 */
export interface ProviderProps {
  children: ReactNode;
}

/**
 * Factory return type
 */
export interface ContextFactory<TState> {
  /** Provider component */
  Provider: React.ComponentType<ProviderProps>;
  /** Context hook */
  useContext: () => ContextValue<TState>;
  /** State-only hook (for components that only read state) */
  useState: () => TState;
  /** Dispatch-only hook (for components that only dispatch actions) */
  useDispatch: () => React.Dispatch<BaseAction>;
}

/**
 * Creates a complete context factory with provider and hooks
 * 
 * This factory generates a standardized React context implementation with:
 * - Type-safe state management
 * - Reducer-based state updates
 * - Optimized re-rendering with separated hooks
 * - Comprehensive error handling
 */
export function createContextFactory<TState>(
  config: ContextFactoryConfig<TState>
): ContextFactory<TState> {
  const { name, initialState, reducer } = config;

  // Create the context
  const Context = createContext<ContextValue<TState> | null>(null);
  Context.displayName = `${name}Context`;

  /**
   * Provider component
   */
  const Provider: React.ComponentType<ProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    // Memoize context value
    const contextValue = useMemo<ContextValue<TState>>(
      () => ({
        state,
        dispatch,
      }),
      [state]
    );

    return React.createElement(Context.Provider, { value: contextValue }, children);
  };

  Provider.displayName = `${name}Provider`;

  /**
   * Main context hook
   */
  const useContextHook = (): ContextValue<TState> => {
    const context = useContext(Context);
    if (!context) {
      throw new Error(`use${name}Context must be used within a ${name}Provider`);
    }
    return context;
  };

  /**
   * State-only hook
   */
  const useStateHook = (): TState => {
    const context = useContext(Context);
    if (!context) {
      throw new Error(`use${name}State must be used within a ${name}Provider`);
    }
    return context.state;
  };

  /**
   * Dispatch-only hook
   */
  const useDispatchHook = (): React.Dispatch<BaseAction> => {
    const context = useContext(Context);
    if (!context) {
      throw new Error(`use${name}Dispatch must be used within a ${name}Provider`);
    }
    return context.dispatch;
  };

  return {
    Provider,
    useContext: useContextHook,
    useState: useStateHook,
    useDispatch: useDispatchHook,
  };
}

/**
 * Factory for creating simple state contexts without actions
 */
export function createSimpleContextFactory<TState>(
  name: string,
  initialState: TState
) {
  const Context = createContext<TState | null>(null);
  Context.displayName = `${name}Context`;

  interface SimpleProviderProps extends ProviderProps {
    value?: TState;
  }

  const Provider: React.ComponentType<SimpleProviderProps> = ({ 
    children, 
    value = initialState 
  }) => {
    return React.createElement(Context.Provider, { value }, children);
  };

  const useContextHook = (): TState => {
    const context = useContext(Context);
    if (context === null) {
      throw new Error(`use${name}Context must be used within a ${name}Provider`);
    }
    return context;
  };

  return {
    Provider,
    useContext: useContextHook,
  };
}

/**
 * Helper function to create action creators
 */
export function createActionCreators<TActions extends Record<string, (...args: any[]) => BaseAction>>(
  actions: TActions
): TActions {
  return actions;
}

/**
 * Helper function to create a reducer with action handlers
 */
export function createReducer<TState>(
  initialState: TState,
  actionHandlers: Record<string, (state: TState, action: BaseAction) => TState>
) {
  return (state: TState = initialState, action: BaseAction): TState => {
    const handler = actionHandlers[action.type];
    return handler ? handler(state, action) : state;
  };
}