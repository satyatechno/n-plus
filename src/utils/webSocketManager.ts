/**
 * WebSocket manager for GraphQL subscriptions with automatic reconnection and subscription management.
 *
 * This class provides a robust WebSocket connection manager specifically designed for GraphQL WebSocket
 * subscriptions using the 'graphql-ws' protocol. It handles connection lifecycle, automatic reconnection
 * on failures, and manages multiple subscriptions with proper cleanup.
 */

export default class WebSocketManager {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectInterval = 5000;
  private retryCount = 0;
  private maxRetries = 10;
  private isManuallyClosed = false;
  private listeners = new Map<string, Array<(payload: unknown) => void>>();
  private pendingSubscriptions: Array<{
    id: string;
    type: string;
    payload: { query: string; variables: Record<string, unknown> };
  }> = [];
  private onReconnectCallback: (() => void) | null = null;

  /**
   * Creates a new WebSocketManager instance.
   *
   * @param url - The WebSocket URL to connect to (should support 'graphql-ws' protocol)
   */
  constructor(url: string) {
    this.url = url;
  }

  /**
   * Sets a callback function to be called when the WebSocket reconnects.
   *
   * @param callback - Function to call on reconnection
   */
  setOnReconnectCallback(callback: () => void) {
    this.onReconnectCallback = callback;
  }

  /**
   * Establishes a WebSocket connection to the GraphQL endpoint.
   *
   * If a connection already exists, it will be closed before creating a new one.
   * Automatically sends the required 'connection_init' message as per graphql-ws protocol.
   * Sets up event handlers for connection lifecycle and message processing.
   *
   * @throws {Error} If the WebSocket URL is invalid or connection fails
   */
  connect() {
    if (this.socket) {
      this.close();
    }

    this.isManuallyClosed = false;

    this.socket = new WebSocket(this.url, 'graphql-ws');

    this.socket.onopen = () => {
      this.retryCount = 0;

      // MUST send init
      this.sendRaw({
        type: 'connection_init',
        payload: {}
      });

      if (this.onReconnectCallback) {
        this.onReconnectCallback();
      }
    };

    this.socket.onmessage = (event: WebSocketMessageEvent) => {
      if (!event?.data) {
        return;
      }
      const message = JSON.parse(event?.data as string);
      this.handleMessage(message);
    };

    this.socket.onclose = () => {
      if (!this.isManuallyClosed) {
        this.reconnect();
      }
    };
  }

  /**
   * Handles incoming WebSocket messages according to the graphql-ws protocol.
   *
   * @param message - The parsed WebSocket message object
   * @private
   */
  private handleMessage(message: { type: string; id?: string; payload?: unknown }) {
    switch (message.type) {
      case 'connection_ack':
        this.pendingSubscriptions.forEach((payload) => this.sendRaw(payload));
        this.pendingSubscriptions = [];
        break;
      case 'data':
        if (message.id && this.listeners.has(message.id)) {
          const callbacks = this.listeners.get(message.id);
          if (callbacks) {
            callbacks.forEach((cb: (payload: unknown) => void) => cb(message.payload));
          }
        }
        break;
      case 'complete':
        if (message.id) {
          this.listeners.delete(message.id);
        }
        break;
      default:
        break;
    }
  }

  /**
   * Creates a GraphQL subscription with the specified parameters.
   *
   * If the connection is not ready, the subscription will be queued and sent
   * once the connection is established. Multiple callbacks can be registered
   * for the same subscription ID.
   *
   * @param id - Unique identifier for this subscription
   * @param query - GraphQL subscription query string
   * @param variables - Variables to be passed with the subscription
   * @param callback - Function to call when subscription data is received
   * @returns Unsubscribe function to stop the subscription
   */
  subscribe(
    id: string,
    query: string,
    variables: Record<string, unknown>,
    callback: (payload: unknown) => void
  ) {
    const payload = {
      id,
      type: 'start',
      payload: { query, variables }
    };

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.sendRaw(payload);
    } else {
      this.pendingSubscriptions.push(payload);
    }

    if (!this.listeners.has(id)) {
      this.listeners.set(id, []);
    }
    this.listeners.get(id)!.push(callback);

    return () => this.unsubscribe(id);
  }

  /**
   * Stops a subscription and removes all associated listeners.
   *
   * @param id - The subscription ID to unsubscribe from
   */
  unsubscribe(id: string) {
    this.sendRaw({ id, type: 'stop' });
    this.listeners.delete(id);
  }

  /**
   * Sends a raw message through the WebSocket connection.
   *
   * Only sends if the connection is open. Messages are automatically
   * JSON stringified before sending.
   *
   * @param message - The message object to send
   * @private
   */
  private sendRaw(message: { id?: string; type: string; payload?: unknown }) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }

  /**
   * Attempts to reconnect to the WebSocket server with exponential backoff.
   *
   * The delay increases with each retry attempt (retryCount * reconnectInterval).
   * Will stop trying after maxRetries attempts or if the connection was manually closed.
   *
   * @private
   */
  private reconnect() {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      const delay = this.reconnectInterval * this.retryCount;
      setTimeout(() => {
        if (!this.isManuallyClosed) {
          this.connect();
        }
      }, delay);
    }
  }

  /**
   * Manually closes the WebSocket connection and prevents automatic reconnection.
   *
   * Sends a 'connection_terminate' message as per graphql-ws protocol before
   * closing the connection. All pending subscriptions and listeners are cleared.
   */
  close() {
    this.isManuallyClosed = true;
    if (this.socket) {
      this.sendRaw({ type: 'connection_terminate' });
      this.socket.close();
      this.socket = null;
    }
  }
}
