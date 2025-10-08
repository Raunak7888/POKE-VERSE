// src/utils/websocket.ts
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { BACKEND_URL } from "./backendUrl";

const WEBSOCKET_URL = `${BACKEND_URL}/ws`;
let stompClient: Client | null = null;

export function connectWebSocket(options: {
  subscriptions?: { topic: string; callback: (message: IMessage) => void }[];
  onConnected?: () => void;
  onDisconnected?: () => void;
  token?: string;
}) {
  const { subscriptions, onConnected, onDisconnected, token } = options;

  if (stompClient && stompClient.connected) {
    console.warn("WebSocket already connected");
    return stompClient;
  }

  stompClient = new Client({
    webSocketFactory: () => new SockJS(WEBSOCKET_URL),
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    reconnectDelay: 5000,
    debug: (msg) => console.log("[STOMP]", msg),

    onConnect: () => {
      console.log("✅ Connected to WebSocket");
      onConnected?.();

      subscriptions?.forEach(({ topic, callback }) => {
        stompClient?.subscribe(topic, callback);
        console.log(`📡 Subscribed to ${topic}`);
      });
    },

    onDisconnect: () => {
      console.log("❌ Disconnected from WebSocket");
      onDisconnected?.();
    },
  });

  stompClient.activate();
  return stompClient;
}

export function disconnectWebSocket() {
  if (stompClient && stompClient.connected) {
    stompClient.deactivate();
    console.log("🔌 WebSocket disconnected");
  }
}

export function sendMessage(destination: string, body: unknown) {
  if (!stompClient || !stompClient.connected) {
    console.warn("STOMP client not connected");
    return;
  }
  stompClient.publish({ destination, body: JSON.stringify(body) });
}
