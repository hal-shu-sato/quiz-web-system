'use client';

import { useEffect, useState } from 'react';

import { socket } from '@/socket';

import { AnswerView, JudgeView, QuestionView, WaitView } from './_components';

import type { SessionStates } from '../admin/[id]/_components/StateChangeButtons';
import type { Judge } from '@/../server/src/sockets/events';

export default function QuizPanel({ id }: { id: string }) {
  const [sessionState, setSessionState] = useState<SessionStates>('wait');

  useEffect(() => {
    function onConnect() {
      console.log('Socket connected');

      socket.io.engine.on('upgrade', (transport) => {
        console.log(`Transport upgraded to: ${transport.name}`);
      });
    }

    function onUpdateState(newState: SessionStates) {
      console.log(`Session state changed to: ${newState}`);
      setSessionState(newState);
    }

    function onUpdateJudge(judge: Judge) {
      console.log(`Judge updated: ${judge.judgment_result}`);
    }

    function onDisconnect() {
      console.log('Socket disconnected');
    }

    if (socket.connected) {
      onConnect();
    }

    socket.on('connect', onConnect);
    socket.on('state:updated', onUpdateState);
    socket.on('judge:updated', onUpdateJudge);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('state:updated', onUpdateState);
      socket.off('judge:updated', onUpdateJudge);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div>
      <h1>Quiz Panel for {id}</h1>
      {sessionState === 'wait' && <WaitView />}
      {sessionState === 'question' && <QuestionView />}
      {sessionState === 'answer' && <AnswerView />}
      {(sessionState === 'judge' ||
        sessionState === 'answer_check' ||
        sessionState === 'judge_check') && (
        <JudgeView
          showAnswer={
            sessionState === 'answer_check' || sessionState === 'judge_check'
          }
          showJudge={sessionState === 'judge_check'}
        />
      )}
    </div>
  );
}
