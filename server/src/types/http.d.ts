import type { Session, SessionData } from 'express-session';
import type { IncomingMessage } from 'http';
import 'http';

declare module 'http' {
  interface IncomingMessage {
    session: Session & Partial<SessionData>;
  }
}
