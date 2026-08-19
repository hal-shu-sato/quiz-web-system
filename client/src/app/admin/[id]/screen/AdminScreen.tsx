'use client';

import { useEffect, useState } from 'react';

import { toAbsoluteFileUrl } from '@/lib/fileUrl';
import adminSocket from '@/sockets/adminSocket';

import { ResultScreen, ScoreScreen } from './_components';

import type {
  AnswerWithJudge,
  Participant,
} from '../../../../../../server/src/sockets/events';
import type { ScreenStates } from '../_components/ScreenChangeButtons';
import type { SessionStates } from '../_components/StateChangeButtons';

export default function AdminScreen({ id }: { id: string }) {
  const [sessionState, setSessionState] = useState<SessionStates>('wait');
  const [screenState, setScreenState] = useState<ScreenStates>('linked');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [answers, setAnswers] = useState<AnswerWithJudge[]>([]);

  useEffect(() => {
    function onUpdateState(newState: SessionStates) {
      setSessionState(newState);
    }

    function onUpdateScreen(newScreen: ScreenStates) {
      setScreenState(newScreen);
    }

    function onUpdateParticipants(nextParticipants: Participant[]) {
      setParticipants(nextParticipants);
    }

    function onUpdateAnswers(nextAnswers: AnswerWithJudge[]) {
      setAnswers(nextAnswers);
    }

    adminSocket.on('state:updated', onUpdateState);
    adminSocket.on('screen:updated', onUpdateScreen);
    adminSocket.on('participants:updated', onUpdateParticipants);
    adminSocket.on('answers:updated', onUpdateAnswers);

    return () => {
      adminSocket.off('state:updated', onUpdateState);
      adminSocket.off('screen:updated', onUpdateScreen);
      adminSocket.off('participants:updated', onUpdateParticipants);
      adminSocket.off('answers:updated', onUpdateAnswers);
    };
  }, [id]);

  const showAnswers =
    (screenState === 'linked' && sessionState === 'answer_check') ||
    screenState === 'answers';
  const showJudges =
    (screenState === 'linked' && sessionState === 'judge_check') ||
    screenState === 'judges';
  const showScores = screenState === 'scores';

  const scoreParticipants = participants.map((participant) => ({
    participant_id: participant.id,
    participant_name: participant.name,
    score: participant.score,
  }));

  const results = answers.map((answer) => ({
    id: answer.id,
    participant_name: answer.participant_name,
    answer_text: 'answer_text' in answer ? answer.answer_text : undefined,
    answer_image_url:
      'answer_image_url' in answer
        ? toAbsoluteFileUrl(answer.answer_image_url)
        : undefined,
    judgment_result: answer.judgment_result,
    awarded_points: answer.awarded_points,
  }));

  if (showScores) {
    return <ScoreScreen participants={scoreParticipants} />;
  }

  return (
    <ResultScreen
      showAnswers={showAnswers || showJudges}
      showJudges={showJudges}
      results={results}
    />
  );
}
