import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Colors } from '../../src/constants/colors';
import { useChatStore } from '../../src/store/chatStore';
import { useCartStore } from '../../src/store/cartStore';
import { useMenu } from '../../src/hooks/useMenu';
import { useChat } from '../../src/hooks/useChat';
import { ChatBubble } from '../../src/components/ChatBubble';
import { TypingIndicator } from '../../src/components/TypingIndicator';
import { SuggestionChips } from '../../src/components/SuggestionChips';

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);
  const { menu } = useMenu();
  const messages = useChatStore((s) => s.messages);
  const isTyping = useChatStore((s) => s.isTyping);
  const clearCart = useCartStore((s) => s.clearCart);
  const { sendMessage } = useChat(menu);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    await sendMessage(text);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  }, [input, sendMessage]);

  const handleSuggestion = useCallback(
    async (text: string) => {
      await sendMessage(text);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    },
    [sendMessage]
  );

  // Undo last AI action by clearing cart (simple undo)
  const handleUndo = useCallback(() => {
    clearCart();
  }, [clearCart]);

  const isEmpty = messages.length === 0;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      android_contentInsetAdjustmentBehavior="never"
    >
      {/* Header */}
      <SafeAreaView style={styles.header}>
        <Text style={styles.headerTitle}>AI Sommelier</Text>
        <Text style={styles.headerSub}>Powered by GPT-4o</Text>
      </SafeAreaView>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble message={item} menu={menu} onUndo={handleUndo} />
        )}
        contentContainerStyle={[styles.messageList, isEmpty && styles.messageListEmpty]}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>Good evening</Text>
            <Text style={styles.emptyDesc}>
              Tell me what you're in the mood for, or try one of these:
            </Text>
          </View>
        }
        ListFooterComponent={isTyping ? <TypingIndicator /> : null}
      />

      {/* Suggestions shown only when chat is empty */}
      {isEmpty && (
        <View style={styles.suggestionsWrapper}>
          <SuggestionChips onSelect={handleSuggestion} />
        </View>
      )}

      {/* Input bar */}
      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Ask about the menu or place an order…"
          placeholderTextColor={Colors.textSubtle}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={400}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!input.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.sendIcon}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg, },
  header: {
    paddingTop: 54,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.bg,
  },
  headerTitle: {
    color: Colors.gold,
    fontSize: 22,
    fontFamily: 'PlayfairDisplay-BoldItalic',
  },
  headerSub: {
    color: Colors.textMuted,
    fontSize: 12,
    fontFamily: 'DMSans-Regular',
    marginTop: 2,
  },
  messageList: { paddingVertical: 12, paddingBottom: 24 },
  messageListEmpty: { flex: 1, justifyContent: 'center' },
  emptyState: { alignItems: 'center', paddingHorizontal: 32, gap: 10 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Italic',
  },
  emptyDesc: {
    color: Colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'DMSans-Regular',
  },
  suggestionsWrapper: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: 12,
    gap: 10,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.elevated,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: 14,
    maxHeight: 100,
    fontFamily: 'DMSans-Regular',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.elevated },
  sendIcon: { color: Colors.black, fontSize: 18, fontWeight: '700' },
});
