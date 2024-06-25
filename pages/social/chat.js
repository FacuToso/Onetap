import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { LoadingSpinner, ConversationCard, MessageCard, PickRecipientForm } from 'components';
import classes from 'styles/chat.module.css';
import { useRef, useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import * as API from 'api/API';
import { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import AuthContext from 'context/AuthContext';
import useScreenSize from 'hooks/useScreenSize';

// TODO: when a large conversation is selected in Mobile, scroll is broken
const Chat = () => {
  const { userId } = useContext(AuthContext);

  const selectedConverationMessagesContainer = useRef(null);

  const { height } = useScreenSize();
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [message, setMessage] = useState('');

  const [creatingConversation, setCreatingConversation] = useState(false);
  const [newConversationRecipient, setNewConversationRecipient] = useState(null);

  const selectedConversation = useMemo(() => {
    if (!selectedUserId) return null;

    return conversations.find((conv) => conv.user.userId === selectedUserId);
  }, [conversations, selectedUserId]);

  useEffect(() => {
    // Automatically scrolling to the last message of the conversation
    if (selectedConversation) {
      selectedConverationMessagesContainer.current.scrollTop = selectedConverationMessagesContainer.current.scrollHeight;
    }
  }, [selectedConversation]);

  const loadConversations = useCallback(() => {
    setLoading(true);

    API.get('/social/chat')
      .then((response) => setConversations(response.data.items))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleConversationClick = useCallback((userId) => {
    setSelectedUserId(userId);
    setCreatingConversation(false);
    setNewConversationRecipient(null);
  }, []);

  const renderConversations = useCallback(() => {
    return conversations.map((conversation) => {
      const lastConversationChatMessage = conversation.messages[conversation.messages.length - 1];

      return (
        <ConversationCard
          key={conversation.user.userId}
          userId={conversation.user.userId}
          selected={selectedUserId === conversation.user.userId}
          chatMessage={lastConversationChatMessage}
          userName={conversation.user.userName}
          profileImageUrl={conversation.user.profileImageUrl}
          showReplyIcon={lastConversationChatMessage.sender.userId !== userId}
          onClick={handleConversationClick}
        />
      );
    });
  }, [selectedUserId, userId, conversations, handleConversationClick]);

  const renderSelectedConversationMessages = useCallback(() => {
    if (creatingConversation) return null;

    return selectedConversation.messages.map((chatMessage, index) => {
      return (
        <MessageCard
          key={index}
          received={chatMessage.sender.userId !== userId}
          userName={chatMessage.sender.userName}
          profileImageUrl={chatMessage.sender.profileImageUrl}
          message={chatMessage.message}
          sentDate={chatMessage.sentDate}
        />
      )
    });
  }, [userId, creatingConversation, selectedConversation]);

  const handleChangeMessage = useCallback((e) => {
    const newValue = e.target.value;

    setMessage(newValue);
  }, []);

  const handleSendMessage = useCallback(() => {
    const rq = {
      recipientId: creatingConversation ? newConversationRecipient.value : selectedUserId,
      message,
    };

    API.post('/social/chat', rq)
      .then((response) => {
        setMessage('');

        // If we are creating a Conversation, we'll just reload the conversations. Otherwise, we'll locally add the new Chat Message to current conversations
        if (creatingConversation) {
          setCreatingConversation(false);
          setNewConversationRecipient(null);
          loadConversations();
        } else {
          setConversations((prevConversations) => prevConversations.map((prevConversation) => {
            if (prevConversation.user.userId === selectedUserId) {
              return {
                ...prevConversation,
                messages: [
                  ...prevConversation.messages,
                  {
                    ...response.data.createdChatMessage,
                  },
                ],
              };
            }

            return prevConversation;
          }).sort((conv1, conv2) => {
            const lastConv1Message = conv1.messages[conv1.messages.length - 1];
            const lastConv2Message = conv2.messages[conv2.messages.length - 1];

            return new Date(lastConv1Message.sentDate) > new Date(lastConv2Message.sentDate) ? -1 : 1;
          }));
        }
      });
  }, [creatingConversation, newConversationRecipient, selectedUserId, message, loadConversations]);

  const handleCreateConversation = useCallback(() => {
    setCreatingConversation(true);
    setSelectedUserId(null);
  }, []);

  const handleNewConversationRecipientChange = useCallback((newRecipient) => {
    setNewConversationRecipient(newRecipient);
  }, []);

  const handleGoBackToConversations = useCallback(() => {
    setCreatingConversation(false);
    setSelectedUserId(null);
  }, []);

  const renderConversationsColumn = useCallback(() => {
    return (
      <>
        <Row className="mb-3">
          <Col className="d-flex justify-content-end">
            <Button className={classes.create_conversation_button} onClick={handleCreateConversation}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </Button>
          </Col>
        </Row>
        <Row className={classes.conversations_container}>
          <Col>
            {renderConversations()}
          </Col>
        </Row>
      </>
    )
  }, [handleCreateConversation, renderConversations]);

  if (loading) return <LoadingSpinner />

  return (
    <section id="chat" className={classes.container}>
      <h1>💬 Chat</h1>
      <div className={classes.main_container}>
        <Row className={classes.chat_container}>
          <Col className="d-none d-xl-block d-lg-block" xl={3} lg={4}>
            {renderConversationsColumn()}
          </Col>
          <Col xl={9} lg={8}>
            {selectedUserId || creatingConversation
              ? (
                <div className={classes.selected_conversation_container}>
                  <Row>
                    <Col>
                      {creatingConversation
                        ? (
                          <PickRecipientForm
                            ignoreIds={[userId, ...Object.keys(conversations)]}
                            recipient={newConversationRecipient}
                            onRecipientChange={handleNewConversationRecipientChange}
                            onGoBack={handleGoBackToConversations}
                          />
                        )
                        : (
                          <ConversationCard
                            className={classes.selected_conversation_card}
                            userName={selectedConversation.user.userName}
                            profileImageUrl={selectedConversation.user.profileImageUrl}
                            onGoBack={handleGoBackToConversations}
                          />
                        )}
                    </Col>
                  </Row>
                  <Row ref={selectedConverationMessagesContainer} style={{ maxHeight: height - 346 }} className={classes.selected_conversation_messages_container}>
                    <Col className="d-flex flex-column">
                      {renderSelectedConversationMessages()}
                    </Col>
                  </Row>
                  {(!creatingConversation || newConversationRecipient) && (
                    <Row className="mt-auto">
                      <Col>
                        <Form>
                          <InputGroup>
                            <Form.Control
                              className={classes.message_input}
                              as="textarea"
                              value={message}
                              onChange={handleChangeMessage}
                              placeholder="Hi!"
                            />
                            <Button className={classes.send_button} disabled={creatingConversation && !newConversationRecipient} onClick={handleSendMessage}>✉️ Send</Button>
                          </InputGroup>
                        </Form>
                      </Col>
                    </Row>
                  )}
                </div>
              )
              : (
                <>
                  <div className={`${classes.pick_conversation_container} d-none d-xl-block d-lg-block`}>
                    <h3>Pick a conversation</h3>
                  </div>
                  <div className="d-xl-none d-lg-none">
                    {renderConversationsColumn()}
                  </div>
                </>
              )}
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Chat;
