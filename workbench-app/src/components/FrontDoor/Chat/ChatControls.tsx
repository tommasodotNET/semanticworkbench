// Copyright (c) Microsoft. All rights reserved.

import { Button, makeStyles, tokens, Tooltip } from '@fluentui/react-components';
import { AppsList24Regular, BookInformation24Regular, Dismiss24Regular } from '@fluentui/react-icons';
import { EventSourceMessage } from '@microsoft/fetch-event-source';
import React from 'react';
import { useChatCanvasController } from '../../../libs/useChatCanvasController';
import { useEnvironment } from '../../../libs/useEnvironment';
import { WorkbenchEventSource, WorkbenchEventSourceType } from '../../../libs/WorkbenchEventSource';
import { useAppSelector } from '../../../redux/app/hooks';

const useClasses = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'row',
        gap: tokens.spacingHorizontalM,
    },
});

interface ChatControlsProps {
    conversationId: string;
}

export const ChatControls: React.FC<ChatControlsProps> = (props) => {
    const { conversationId } = props;
    const classes = useClasses();
    const chatCanvasState = useAppSelector((state) => state.chatCanvas);
    const environment = useEnvironment();
    const chatCanvasController = useChatCanvasController();

    React.useEffect(() => {
        var workbenchEventSource: WorkbenchEventSource | undefined;

        const handleFocusEvent = async (event: EventSourceMessage) => {
            const { data } = JSON.parse(event.data);
            chatCanvasController.transitionToState({
                open: true,
                mode: 'assistant',
                selectedAssistantId: data['assistant_id'],
                selectedAssistantStateId: data['state_id'],
            });
        };

        (async () => {
            workbenchEventSource = await WorkbenchEventSource.createOrUpdate(
                environment.url,
                WorkbenchEventSourceType.Conversation,
                conversationId,
            );
            workbenchEventSource.addEventListener('assistant.state.focus', handleFocusEvent);
        })();

        return () => {
            workbenchEventSource?.removeEventListener('assistant.state.focus', handleFocusEvent);
        };
    }, [environment, conversationId, chatCanvasController]);

    const handleActivateConversation = () => {
        chatCanvasController.transitionToState({ open: true, mode: 'conversation' });
    };

    const handleActivateAssistant = () => {
        chatCanvasController.transitionToState({ open: true, mode: 'assistant' });
    };

    const handleDismiss = async () => {
        chatCanvasController.transitionToState({ open: false });
    };

    const conversationActive = chatCanvasState.mode === 'conversation' && chatCanvasState.open;
    const assistantActive = chatCanvasState.mode === 'assistant' && chatCanvasState.open;

    return (
        <div className={classes.root}>
            <Tooltip content="Open conversation canvas" relationship="label">
                <Button
                    disabled={conversationActive || chatCanvasController.isTransitioning}
                    icon={<AppsList24Regular />}
                    onClick={handleActivateConversation}
                />
            </Tooltip>
            <Tooltip content="Open assistant canvas" relationship="label">
                <Button
                    disabled={assistantActive || chatCanvasController.isTransitioning}
                    icon={<BookInformation24Regular />}
                    onClick={handleActivateAssistant}
                />
            </Tooltip>
            {conversationActive || assistantActive ? (
                <Tooltip content="Close canvas" relationship="label">
                    <Button icon={<Dismiss24Regular />} onClick={handleDismiss} />
                </Tooltip>
            ) : null}
        </div>
    );
};