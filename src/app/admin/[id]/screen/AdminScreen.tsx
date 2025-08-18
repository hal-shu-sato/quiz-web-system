'use client';

import { useEffect, useState } from 'react';

import { adminSocket } from '@/socket';

import { ResultScreen, ScoreScreen } from './_components';

type ScreenStates = 'answers' | 'judges' | 'scores';

export default function AdminScreen({ id }: { id: string }) {
  const [screen, setScreen] = useState<ScreenStates>('answers');

  useEffect(() => {
    function onConnect() {
      console.log('Admin socket connected');

      adminSocket.io.engine.on('upgrade', (transport) => {
        console.log(`Transport upgraded to: ${transport.name}`);
      });
    }

    function onUpdateScreen(newScreen: ScreenStates) {
      console.log(`Screen state changed to: ${newScreen}`);
      setScreen(newScreen);
    }

    function onDisconnect() {
      console.log('Admin socket disconnected');
    }

    if (adminSocket.connected) {
      onConnect();
    }

    adminSocket.on('connect', onConnect);
    adminSocket.on('screen:update', onUpdateScreen);
    adminSocket.on('disconnect', onDisconnect);

    return () => {
      adminSocket.off('connect', onConnect);
      adminSocket.off('screen:update', onUpdateScreen);
      adminSocket.off('disconnect', onDisconnect);
    };
  }, []);

  if (screen === 'answers' || screen === 'judges') {
    return (
      <ResultScreen
        showJudges={screen === 'judges'}
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

  if (screen === 'scores') {
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
    <div>
      <h1>Admin Screen</h1>
    </div>
  );
}
