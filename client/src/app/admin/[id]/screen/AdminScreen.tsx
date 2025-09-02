'use client';

import { useEffect, useState } from 'react';

import adminSocket from '@/sockets/adminSocket';

import { ResultScreen, ScoreScreen } from './_components';

import type { ScreenStates } from '../_components/ScreenChangeButtons';
import type { SessionStates } from '../_components/StateChangeButtons';

export default function AdminScreen({ id }: { id: string }) {
  const [sessionState, setSessionState] = useState<SessionStates>('wait');
  const [screenState, setScreenState] = useState<ScreenStates>('linked');

  useEffect(() => {
    function onConnect() {
      console.log('Admin socket connected');

      adminSocket.io.engine.on('upgrade', (transport) => {
        console.log(`Transport upgraded to: ${transport.name}`);
      });
    }

    function onUpdateState(newState: SessionStates) {
      console.log(`Session state changed to: ${newState}`);
      setSessionState(newState);
    }

    function onUpdateScreen(newScreen: ScreenStates) {
      console.log(`Screen state changed to: ${newScreen}`);
      setScreenState(newScreen);
    }

    function onDisconnect() {
      console.log('Admin socket disconnected');
    }

    if (adminSocket.connected) {
      onConnect();
    }

    adminSocket.on('connect', onConnect);
    adminSocket.on('state:updated', onUpdateState);
    adminSocket.on('screen:updated', onUpdateScreen);
    adminSocket.on('disconnect', onDisconnect);

    return () => {
      adminSocket.off('connect', onConnect);
      adminSocket.off('state:updated', onUpdateState);
      adminSocket.off('screen:updated', onUpdateScreen);
      adminSocket.off('disconnect', onDisconnect);
    };
  }, []);

  const showAnswers =
    (screenState === 'linked' && sessionState === 'answer_check') ||
    screenState === 'answers';
  const showJudges =
    (screenState === 'linked' && sessionState === 'judge_check') ||
    screenState === 'judges';
  const showScores = screenState === 'scores';

  if (showScores) {
    return (
      <ScoreScreen
        participants={[
          { participant_id: '1', participant_name: '参加者1', score: 100 },
          { participant_id: '2', participant_name: '参加者2', score: 80 },
          { participant_id: '3', participant_name: '参加者3', score: 60 },
          { participant_id: '4', participant_name: '参加者4', score: 40 },
          { participant_id: '5', participant_name: '参加者5', score: 20 },
          { participant_id: '6', participant_name: '参加者6', score: 10 },
        ]}
      />
    );
  }

  return (
    <ResultScreen
      showAnswers={showAnswers || showJudges}
      showJudges={showJudges}
      results={[
        {
          id: '1',
          participant_name: '参加者1',
          answer_text: '回答1',
          answer_image_url: ' https://placehold.co/80x45/FFFFFF/000000',
          judgment_result: 'correct',
          awarded_points: 10,
        },
        {
          id: '2',
          participant_name: '参加者2',
          answer_text: '回答2',
          answer_image_url: 'https://placehold.co/640x360/FFFFFF/000000',
          judgment_result: 'incorrect',
          awarded_points: 0,
        },
        {
          id: '3',
          participant_name: '参加者3',
          answer_text: '回答3',
          answer_image_url: 'https://placehold.co/640x360/FFFFFF/000000',
          judgment_result: 'partial',
          awarded_points: 5,
        },
        {
          id: '4',
          participant_name: '参加者4',
          answer_text: '回答4',
          answer_image_url: 'https://placehold.co/640x360/FFFFFF/000000',
          judgment_result: 'dobon',
          awarded_points: 0,
        },
        {
          id: '5',
          participant_name: '参加者5',
          answer_text: '回答5',
          answer_image_url: 'https://placehold.co/640x360/FFFFFF/000000',
          judgment_result: 'pending',
          awarded_points: 0,
        },
      ]}
    />
  );
}
