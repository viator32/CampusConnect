import { mapClub, mapEvent, mapPost, mapComment } from './mappers';
import { Subject, Preference } from '../profile/types';

describe('club mappers', () => {
  test('mapClub transforms club dto', () => {
    const dto = {
      id: 1,
      name: 'Chess Club',
      avatar: 'raw',
      membersCount: 10,
      events: [],
      posts: [],
    };
    const club = mapClub(dto);
    expect(club).toMatchObject({
      id: '1',
      name: 'Chess Club',
      avatar: 'data:image/png;base64,raw',
      members: 10,
      description: '',
      category: 'General',
      subject: Subject.NONE,
      interest: Preference.NONE,
      events: [],
      posts: [],
    });
  });

  test('mapEvent transforms event dto', () => {
    const dto = {
      id: 2,
      title: 'Meeting',
      attendees: [{ userId: 5, username: 'Alice', email: 'a@a.com' }],
      date: '2025-01-01',
      time: '10:00',
      location: 'Room',
    };
    const ev = mapEvent(dto);
    expect(ev).toMatchObject({
      id: 2,
      title: 'Meeting',
      joined: 1,
      participants: [
        { id: 5, name: 'Alice', surname: '', email: 'a@a.com', avatar: '' },
      ],
    });
  });

  test('mapPost transforms post dto', () => {
    const dto = {
      id: 'p1',
      author: { username: 'Bob', avatar: 'a' },
      content: 'Hello',
      likes: 3,
      comments: 1,
      time: 'now',
      likedByMe: true,
    };
    const post = mapPost(dto);
    expect(post).toMatchObject({
      id: 'p1',
      author: 'Bob',
      avatar: 'a',
      content: 'Hello',
      likes: 3,
      comments: 1,
      time: 'now',
      liked: true,
    });
  });

  test('mapComment transforms comment dto', () => {
    const dto = {
      id: 'c1',
      author: { username: 'Alice', avatar: 'z' },
      content: 'Nice',
      time: 'now',
      likes: 2,
      likedByUser: true,
    };
    const comment = mapComment(dto);
    expect(comment).toMatchObject({
      id: 'c1',
      author: 'Alice',
      content: 'Nice',
      time: 'now',
      likes: 2,
      avatar: 'z',
      liked: true,
    });
  });
});
