/**
 * src/app/chat/page.tsx
 * Страница с чат-ботом
 */
import { ChatBot } from '@/components/ChatBot';

export default function ChatPage() {
  return (
    <main style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <ChatBot />
    </main>
  );
}
