import type { Session } from '../generated/prisma';
import prisma from '../lib/prisma';

export type SessionCreationParams = Pick<
  Session,
  'title' | 'code' | 'startAt' | 'endAt'
>;

export class SessionService {
  public create(data: SessionCreationParams) {
    return prisma.session.create({
      data: {
        title: data.title,
        code: data.code,
        startAt: data.startAt,
        endAt: data.endAt,
      },
    });
  }

  public getById(id: string) {
    return prisma.session.findUnique({
      where: { id },
    });
  }

  public getByCode(code: string) {
    return prisma.session.findUnique({
      where: { code },
    });
  }

  public update(id: string, data: Partial<Session>) {
    return prisma.session.update({
      where: { id },
      data,
    });
  }

  public delete(id: string) {
    return prisma.session.delete({
      where: { id },
    });
  }
}
