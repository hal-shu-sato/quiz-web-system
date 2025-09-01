import type { $Enums } from '../../generated/prisma';
import type { SessionState } from '../sockets/events';

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
    default:
      throw new Error(`Unknown state: ${state}`);
  }
}
