
// Event handling type definitions
export interface BaseEvent {
  id: string;
  timestamp: Date;
  userId: string;
}

export interface ClickEvent extends BaseEvent {
  type: 'click';
  elementId: string;
  coordinates: { x: number; y: number };
}

export interface FormSubmitEvent extends BaseEvent {
  type: 'form_submit';
  formId: string;
  formData: Record<string, any>;
  success: boolean;
}

export interface NavigationEvent extends BaseEvent {
  type: 'navigation';
  from: string;
  to: string;
  method: 'push' | 'replace' | 'back' | 'forward';
}

export type AppEvent = ClickEvent | FormSubmitEvent | NavigationEvent;

export interface EventHandler<T extends AppEvent = AppEvent> {
  (event: T): void | Promise<void>;
}

export interface EventSubscription {
  unsubscribe: () => void;
}
