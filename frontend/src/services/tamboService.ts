import { io, Socket } from 'socket.io-client';
import {
  GenerationRequest,
  RefinementRequest,
  GeneratedComponent,
  ProgressUpdate,
  ErrorEvent,
} from '../types';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

class TamboService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to Tambo service');
      this.emit('connection', { status: 'connected' });
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Tambo service');
      this.emit('connection', { status: 'disconnected' });
    });

    this.socket.on('component-generated', (data: GeneratedComponent) => {
      this.emit('component-generated', data);
    });

    this.socket.on('component-updated', (data: GeneratedComponent) => {
      this.emit('component-updated', data);
    });

    this.socket.on('generation-progress', (data: ProgressUpdate) => {
      this.emit('generation-progress', data);
    });

    this.socket.on('generation-error', (data: ErrorEvent) => {
      this.emit('generation-error', data);
    });
  }

  generateComponent(request: GenerationRequest) {
    if (!this.socket?.connected) {
      this.connect();
    }
    this.socket?.emit('generate-component', request);
  }

  updateComponent(request: RefinementRequest) {
    if (!this.socket?.connected) {
      this.connect();
    }
    this.socket?.emit('update-component', request);
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach((callback) => callback(data));
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const tamboService = new TamboService();
