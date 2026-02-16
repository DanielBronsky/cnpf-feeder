'use client';

/**
 * src/components/ChatBot/ChatBot.tsx
 * Компонент чат-бота с ИИ
 */
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { CHAT_QUERY } from '@/lib/graphql/queries';
import {
  ChatContainer,
  ChatHeader,
  ChatTitle,
  ChatSubtitle,
  MessagesContainer,
  Message,
  MessageBubble,
  ResultsList,
  ResultCard,
  ResultTitle,
  ResultMeta,
  InputContainer,
  Input,
  SendButton,
  LoadingIndicator,
} from './ChatBot.styles';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  results?: Array<{
    id: string;
    type: 'report' | 'competition';
    title: string;
    hasPhotos: boolean;
    photosCount: number;
    location?: string;
  }>;
}

export function ChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Привет! Я помощник по сайту о рыбалке. Спросите меня, например: "Отчет о Днестре" или "соревнования в Данченах"',
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [currentQuery, setCurrentQuery] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { data, loading, error } = useQuery(CHAT_QUERY, {
    variables: { query: currentQuery || '' },
    skip: !currentQuery,
    fetchPolicy: 'network-only',
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (data?.chat) {
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        text: data.chat.message,
        isUser: false,
        results: data.chat.results.map((r: any) => ({
          id: r.id,
          type: r.type,
          title: r.title,
          hasPhotos: r.hasPhotos,
          photosCount: r.photosCount,
          location: r.location,
        })),
      };
      setMessages((prev) => [...prev, botMessage]);
      setCurrentQuery(null);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `Ошибка: ${error.message || 'Неизвестная ошибка'}`,
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
      setCurrentQuery(null);
    }
  }, [error]);

  const handleSend = () => {
    const query = inputValue.trim();
    if (!query || currentQuery) return;

    // Добавляем сообщение пользователя
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: query,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setCurrentQuery(query);
  };

  const handleResultClick = (result: {
    id: string;
    type: 'report' | 'competition';
    title: string;
    hasPhotos: boolean;
    photosCount: number;
    location?: string;
  }) => {
    if (result.type === 'report') {
      router.push(`/feed/report/${result.id}`);
    } else {
      router.push(`/competitions/${result.id}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatContainer>
      <ChatHeader>
        <ChatTitle>Чат-бот с ИИ</ChatTitle>
        <ChatSubtitle>Задайте вопрос о отчетах или соревнованиях</ChatSubtitle>
      </ChatHeader>

      <MessagesContainer>
        {messages.map((msg) => (
          <div key={msg.id}>
            <Message $isUser={msg.isUser}>
              <MessageBubble $isUser={msg.isUser}>{msg.text}</MessageBubble>
            </Message>
            {msg.results && msg.results.length > 0 && (
              <ResultsList>
                {msg.results.map((result) => (
                  <ResultCard
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                  >
                    <ResultTitle>
                      {result.type === 'report' ? '📄 Отчет' : '🏆 Соревнование'}: {result.title}
                    </ResultTitle>
                    <ResultMeta>
                      {result.hasPhotos && `${result.photosCount} фото`}
                      {result.location && ` • ${result.location}`}
                    </ResultMeta>
                  </ResultCard>
                ))}
              </ResultsList>
            )}
          </div>
        ))}
        {loading && (
          <Message $isUser={false}>
            <MessageBubble $isUser={false}>
              <LoadingIndicator>Думаю...</LoadingIndicator>
            </MessageBubble>
          </Message>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите ваш вопрос..."
          disabled={loading || !!currentQuery}
        />
        <SendButton onClick={handleSend} disabled={loading || !!currentQuery || !inputValue.trim()}>
          Отправить
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
}
