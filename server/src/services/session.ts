import type { Session } from '../generated/prisma';
import prisma from '../lib/prisma';

export type SessionCreationParams = Pick<
  Session,
  'title' | 'code' | 'startAt' | 'endAt'
>;

export class SessionService {
  create(data: SessionCreationParams) {
    return prisma.session.create({
      data: {
        title: data.title,
        code: data.code,
        startAt: data.startAt,
        endAt: data.endAt,
      },
    });
  }

  getById(id: string) {
    return prisma.session.findUnique({
      where: { id },
    });
  }

  getByCode(code: string) {
    return prisma.session.findUnique({
      where: { code },
    });
  }

  update(id: string, data: Partial<Session>) {
    return prisma.session.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return prisma.session.delete({
      where: { id },
    });
  }
}
