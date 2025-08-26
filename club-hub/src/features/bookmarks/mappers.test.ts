import { mapBookmarkedPost } from './mappers';

describe('bookmarks mappers', () => {
  test('mapBookmarkedPost transforms dto', () => {
    const dto = {
      id: 1,
      author: { username: 'John', avatar: 'a' },
      content: 'Hi',
      createdAt: '2025-01-01',
      likes: 4,
      comments: 2,
      club: { id: 'c1', name: 'Chess', image: 'img' },
      likedByMe: true,
    };
    const post = mapBookmarkedPost(dto);
    expect(post).toMatchObject({
      id: '1',
      author: 'John',
      authorAvatar: 'a',
      content: 'Hi',
      time: '2025-01-01',
      likes: 4,
      comments: 2,
      clubId: 'c1',
      clubName: 'Chess',
      clubImage: 'img',
      liked: true,
    });
  });
});
