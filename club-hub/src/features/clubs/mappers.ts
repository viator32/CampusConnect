import type { Club, Event as ClubEvent, Post, Comment, Member } from './types';
import { Subject, Preference } from '../profile/types';

/** Normalize a backend club DTO to the app's `Club` model. */
export function mapClub(dto: any): Club {
  const rawId = dto.id ?? dto.clubId ?? dto._id;
  const rawAvatar = dto.avatar ?? '';
  const avatar = rawAvatar && !rawAvatar.startsWith('data:')
    ? `data:image/png;base64,${rawAvatar}`
    : rawAvatar;
  return {
    id: String(rawId),
    name: dto.name,
    description: dto.description ?? '',
    category: dto.category ?? 'General',
    subject: dto.subject ?? Subject.NONE,
    interest: dto.interest ?? Preference.NONE,
    avatar,
    members: dto.membersCount ?? dto.members ?? 0,
    isJoined: !!dto.isJoined,

    events: (dto.events ?? []).map(mapEvent),
    posts: (dto.posts ?? [])
      .map(mapPost)
      .sort((a: Post, b: Post) => new Date(b.time).getTime() - new Date(a.time).getTime()),
    members_list: (dto.membersList ?? dto.members_list ?? []).map(mapMember),
    forum_threads: dto.forumThreads ?? dto.forum_threads ?? [],
  };
}

/** Normalize a backend member DTO into a `Member`. */
export function mapMember(dto: any): Member {
  return {
    id: dto.id ?? dto.membershipId ?? '',
    userId: dto.userId ?? dto.user_id ?? dto.id ?? '',
    name: dto.name ?? dto.username ?? '',
    role: dto.role ?? 'MEMBER',
    avatar: dto.avatar ?? '',
  };
}

/** Normalize a backend event DTO into an `Event`. */
export function mapEvent(dto: any): ClubEvent {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    date: dto.date,
    time: dto.time,
    location: dto.location,
    status: (dto.status ?? 'SCHEDULED') as any,
    joined:
      dto.participantsCount ?? dto.joined ?? dto.attendeesCount ?? dto.attendees?.length,
    participants: (dto.participants ?? dto.attendees ?? []).map((p: any) => ({
      id: p.id ?? p.userId ?? '',
      name: p.name ?? p.username ?? '',
      surname: p.surname ?? '',
      email: p.email ?? '',
      avatar: p.avatar ?? '',
    })),
  };
}

/** Normalize a backend post DTO into a `Post`. */
export function mapPost(dto: any): Post {
  return {
    id: dto.id,
    author: dto.author?.username ?? dto.author ?? dto.username ?? 'Unknown',
    avatar: dto.author?.avatar ?? dto.avatar ?? '',
    content: dto.content ?? '',
    likes: dto.likes ?? 0,
    comments: dto.comments ?? 0,
    time: dto.time ?? dto.createdAt ?? '',
    commentsList: dto.commentsList ?? [],
    photo: dto.photo,
    poll: dto.poll,
    liked: dto.liked ?? dto.likedByUser ?? dto.likedByMe ?? false,
  };
}

/** Normalize a backend comment DTO into a `Comment`. */
export function mapComment(dto: any): Comment {
  return {
    id: dto.id,
    author: dto.author?.username ?? dto.author ?? dto.username ?? 'Unknown',
    content: dto.content ?? '',
    time: dto.time ?? dto.createdAt ?? '',
    likes: dto.likes ?? 0,
    avatar: dto.author?.avatar ?? dto.avatar ?? '',
    liked: dto.liked ?? dto.likedByUser ?? dto.likedByMe ?? false,
  };
}
