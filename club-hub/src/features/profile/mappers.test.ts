import { mapUser, mapUserToDto } from './mappers';
import { Subject } from './types';

describe('profile mappers', () => {
  test('mapUser transforms user dto', () => {
    const dto = {
      id: 2,
      username: 'Alice',
      email: 'a@a.com',
      avatar: 'av',
      subject: Subject.COMPUTER_SCIENCE,
      preferences: ['GAMING'],
      memberships: [
        {
          id: 1,
          clubId: 'c1',
          name: 'Chess',
          role: 'MEMBER',
          avatar: 'img',
          joinedAt: '2025-01-01',
        },
      ],
      settings: { notifications: {}, privacy: {}, preferences: {} },
    };
    const user = mapUser(dto);
    expect(user).toMatchObject({
      id: '2',
      name: 'Alice',
      email: 'a@a.com',
      avatar: 'av',
      subject: Subject.COMPUTER_SCIENCE,
      preferences: ['GAMING'],
      memberships: [
        {
          id: 1,
          clubId: 'c1',
          name: 'Chess',
          role: 'MEMBER',
          avatar: 'img',
          joinedAt: '2025-01-01',
        },
      ],
    });
  });

  test('mapUserToDto transforms partial user', () => {
    const partial = {
      name: 'Bob',
      description: 'desc',
      subject: Subject.BUSINESS,
      preferences: ['MUSIC'],
    } as any;
    const dto = mapUserToDto(partial);
    expect(dto).toEqual({
      username: 'Bob',
      description: 'desc',
      subject: Subject.BUSINESS,
      preferences: ['MUSIC'],
    });
  });
});
