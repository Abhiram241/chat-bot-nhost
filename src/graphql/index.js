import { gql } from "@apollo/client";

// ===== QUERIES =====
export const GET_CHATS = gql`
  query {
    chats(order_by: { created_at: desc }) {
      id
      title
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      role
      content
    }
  }
`;

// ===== MUTATIONS =====
export const CREATE_CHAT = gql`
  mutation {
    insert_chats_one(object: { title: "New Chat" }) {
      id
      title
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($chat_id: uuid!, $content: String!) {
    sendMessage(chat_id: $chat_id, content: $content) {
      assistant_text
      message_id
    }
  }
`;

export const INSERT_USER_MESSAGE = gql`
  mutation InsertUserMessage($chat_id: uuid!, $content: String!) {
    insert_messages_one(
      object: { chat_id: $chat_id, role: "user", content: $content }
    ) {
      id
    }
  }
`;

// ===== SUBSCRIPTIONS =====
export const MESSAGE_SUB = gql`
  subscription GetMessages($chatId: uuid!) {
    messages(
      where: { chat_id: { _eq: $chatId } }
      order_by: { created_at: asc }
    ) {
      id
      role
      content
    }
  }
`;

// ===== TEST QUERY =====
export const PING = gql`
  query {
    __typename
  }
`;
