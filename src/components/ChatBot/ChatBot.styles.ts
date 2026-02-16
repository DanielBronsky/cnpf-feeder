/**
 * src/components/ChatBot/ChatBot.styles.ts
 * Стили для чат-бота
 */
import styled from 'styled-components';
import { PrimaryButtonBase } from '@/components/Button/Button';

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 600px;
  max-height: 80vh;
  border-radius: 18px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  overflow: hidden;
`;

export const ChatHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.04);
`;

export const ChatTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.01em;
`;

export const ChatSubtitle = styled.p`
  margin: 4px 0 0 0;
  font-size: 13px;
  opacity: 0.7;
`;

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
`;

export const Message = styled.div<{ $isUser?: boolean }>`
  display: flex;
  justify-content: ${props => props.$isUser ? 'flex-end' : 'flex-start'};
`;

export const MessageBubble = styled.div<{ $isUser?: boolean }>`
  max-width: 75%;
  padding: 12px 16px;
  border-radius: 16px;
  background: ${props => props.$isUser 
    ? 'linear-gradient(180deg, rgba(99, 102, 241, 0.9) 0%, rgba(79, 70, 229, 0.9) 100%)'
    : 'rgba(255, 255, 255, 0.08)'};
  color: ${props => props.$isUser ? '#fff' : 'var(--text)'};
  border: 1px solid ${props => props.$isUser 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'var(--border)'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

export const ResultsList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ResultCard = styled.div`
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateX(4px);
  }
`;

export const ResultTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 4px;
`;

export const ResultMeta = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

export const InputContainer = styled.div`
  padding: 16px;
  border-top: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  gap: 10px;
`;

export const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: var(--input-bg);
  color: var(--text);
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: rgba(99, 102, 241, 0.5);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  
  &::placeholder {
    opacity: 0.5;
  }
`;

export const SendButton = styled(PrimaryButtonBase)`
  padding: 12px 20px;
  min-width: 80px;
`;

export const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
`;

export const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  
  &::after {
    content: '...';
    animation: dots 1.5s steps(4, end) infinite;
  }
  
  @keyframes dots {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60%, 100% { content: '...'; }
  }
`;
