export type SessionState =
  | 'wait'
  | 'question'
  | 'answer'
  | 'judge'
  | 'answer_check'
  | 'judge_check';

export type ScreenState = 'linked' | 'answers' | 'judges' | 'scores';

export type Participant = {
  id: string;
  name: string;
  score: number;
  is_dobon: boolean;
  answer_order: number;
};

export type Question = {
  id: string;
  title: string;
  max_points: number;
  type: 'normal' | 'dobon';
};

type AnswerBase = {
  id: string;
  participant_id: string;
  participant_name: string;
  question_id: string;
};

type TextAnswer = AnswerBase & {
  answer_text: string;
};
type ImageAnswer = AnswerBase & {
  answer_image_url: string;
};

export type Answer = TextAnswer | ImageAnswer;

export type AnswerWithImage = AnswerBase & {
  answer_base64?: string;
};

export type Judge = {
  answer_id: string;
  judgment_result: 'pending' | 'correct' | 'partial' | 'incorrect' | 'dobon';
  awarded_points: number;
};

export type AnswerWithJudge = Answer & Omit<Judge, 'answer_id'>;

export interface ServerToClientEvents {
  'state:updated': (state: SessionState) => void;

  'judge:updated': (judge: Judge) => void;
}

export interface ClientToServerEvents {
  'answer:create': (
    answer: Omit<TextAnswer, 'id'> | Omit<AnswerWithImage, 'id'>,
  ) => void;
}

export interface AdminServerToClientEvents {
  'state:updated': (state: SessionState) => void;

  'screen:updated': (screen: ScreenState) => void;

  'participants:updated': (participants: Participant[]) => void;

  'question:updated': (question: Question) => void;

  'answers:updated': (answers: AnswerWithJudge[]) => void;
}

export interface AdminClientToServerEvents {
  'state:update': (state: SessionState) => void;

  'screen:update': (screen: ScreenState) => void;

  'question:create': (question: Omit<Question, 'id'>) => void;

  'question:update': (id: string, question: Omit<Question, 'id'>) => void;

  'judge:update': (answer_id: string, judge: Omit<Judge, 'answer_id'>) => void;

  'answer:delete': (id: string) => void;
}
