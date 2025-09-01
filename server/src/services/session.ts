import prisma from '../lib/prisma';

import type { Session } from '../../generated/prisma';

export type SessionCreationParams = Pick<Session, 'title' | 'code'>;
export type SessionUpdateParams = Partial<Session>;

export class SessionService {
  public create(data: SessionCreationParams) {
    return prisma.session.create({
      data: {
        title: data.title,
        code: data.code,
        startAt: null,
        endAt: null,
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

  public update(id: string, data: SessionUpdateParams) {
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
