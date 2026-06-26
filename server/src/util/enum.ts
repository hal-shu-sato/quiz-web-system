import type { $Enums } from '../../generated/prisma';
import type { ScreenState, SessionState } from '../sockets/events';

export function mapPrismaStateToSocketState(state: $Enums.State): SessionState {
  switch (state) {
    case 'WAIT':
      return 'wait';
    case 'QUESTION':
      return 'question';
    case 'ANSWER':
      return 'answer';
    case 'JUDGE':
      return 'judge';
    case 'ANSWER_CHECK':
      return 'answer_check';
    case 'JUDGE_CHECK':
      return 'judge_check';
  }
}

export function mapSocketStateToPrismaState(state: SessionState): $Enums.State {
  switch (state) {
    case 'wait':
      return 'WAIT';
    case 'question':
      return 'QUESTION';
    case 'answer':
      return 'ANSWER';
    case 'judge':
      return 'JUDGE';
    case 'answer_check':
      return 'ANSWER_CHECK';
    case 'judge_check':
      return 'JUDGE_CHECK';
  }
}

export function mapPrismaScreenToSocket(
  screen: $Enums.ScreenState,
): ScreenState {
  switch (screen) {
    case 'LINKED':
      return 'linked';
    case 'ANSWERS':
      return 'answers';
    case 'JUDGES':
      return 'judges';
    case 'SCORES':
      return 'scores';
  }
}

export function mapSocketScreenToPrisma(
  screen: ScreenState,
): $Enums.ScreenState {
  switch (screen) {
    case 'linked':
      return 'LINKED';
    case 'answers':
      return 'ANSWERS';
    case 'judges':
      return 'JUDGES';
    case 'scores':
      return 'SCORES';
  }
}

export function mapPrismaQuestionTypeToSocket(
  type: $Enums.QuestionType,
): 'normal' | 'dobon' {
  return type === 'DOBON' ? 'dobon' : 'normal';
}

export function mapSocketQuestionTypeToPrisma(
  type: 'normal' | 'dobon',
): $Enums.QuestionType {
  return type === 'dobon' ? 'DOBON' : 'NORMAL';
}

export function mapPrismaJudgmentToSocket(
  result: $Enums.JudgmentResult,
): 'pending' | 'correct' | 'partial' | 'incorrect' | 'dobon' {
  switch (result) {
    case 'PENDING':
      return 'pending';
    case 'CORRECT':
      return 'correct';
    case 'PARTIAL':
      return 'partial';
    case 'INCORRECT':
      return 'incorrect';
    case 'DOBON':
      return 'dobon';
  }
}

export function mapSocketJudgmentToPrisma(
  result: 'pending' | 'correct' | 'partial' | 'incorrect' | 'dobon',
): $Enums.JudgmentResult {
  switch (result) {
    case 'pending':
      return 'PENDING';
    case 'correct':
      return 'CORRECT';
    case 'partial':
      return 'PARTIAL';
    case 'incorrect':
      return 'INCORRECT';
    case 'dobon':
      return 'DOBON';
  }
}
