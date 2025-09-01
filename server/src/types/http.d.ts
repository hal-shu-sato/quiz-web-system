import type { Session, SessionData } from 'express-session';
import 'http';

declare module 'http' {
  interface IncomingMessage {
    session: Session & Partial<SessionData>;
  }
}
