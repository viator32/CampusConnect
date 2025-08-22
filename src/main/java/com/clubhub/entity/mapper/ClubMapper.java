package com.clubhub.entity.mapper;

import java.time.LocalDate;
import java.util.Base64;
import java.util.UUID;
import com.clubhub.entity.Club;
import com.clubhub.entity.Comment;
import com.clubhub.entity.Event;
import com.clubhub.entity.ForumThread;
import com.clubhub.entity.Member;
import com.clubhub.entity.Poll;
import com.clubhub.entity.PollOption;
import com.clubhub.entity.Post;
import com.clubhub.entity.dto.ClubDTO;
import com.clubhub.entity.dto.CommentDTO;
import com.clubhub.entity.dto.EventDTO;
import com.clubhub.entity.dto.ForumThreadDTO;
import com.clubhub.entity.dto.MemberDTO;
import com.clubhub.entity.dto.PollDTO;
import com.clubhub.entity.dto.PollOptionDTO;
import com.clubhub.entity.dto.PostDTO;

public class ClubMapper {

        public static ClubDTO toDTO(Club club) {
                return toDTO(club, null);
        }

        public static ClubDTO toDTO(Club club, UUID userId) {
                ClubDTO dto = toSummaryDTO(club);

                dto.events = club.getEvents().stream().map(ClubMapper::toDTO).toList();
                dto.posts = club.getPosts().stream().map(p -> toDTO(p, userId)).toList();
                dto.members_list = club.getMembersList().stream().map(ClubMapper::toDTO).toList();
                dto.forum_threads = club.getForumThreads().stream().map(ClubMapper::toDTO).toList();

                return dto;
        }

	public static ClubDTO toSummaryDTO(Club club) {
		ClubDTO dto = new ClubDTO();
		dto.id = club.getId();
		dto.name = club.getName();
                dto.description = club.getDescription();
                dto.category = club.getCategory();
                dto.image = club.getImage();
                dto.location = club.getLocation();
                dto.avatar = club.getAvatar() != null ? Base64.getEncoder().encodeToString(club.getAvatar()) : null;
                dto.isJoined = club.isJoined();
                dto.members = club.getMembersList() != null ? club.getMembersList().size() : 0;
                dto.eventsCount = club.getEvents() != null ? club.getEvents().size() : 0;
                dto.postsCount = club.getPosts() != null ? club.getPosts().size() : 0;
                return dto;
	}

	public static Club toEntity(ClubDTO dto) {
		Club club = new Club();

		if (dto.id != null) {
			club.setId(dto.id);
		}

		club.setName(dto.name);
                club.setDescription(dto.description);
                club.setCategory(dto.category);
                club.setImage(dto.image);
                club.setLocation(dto.location);
                if (dto.avatar != null) {
                        club.setAvatar(Base64.getDecoder().decode(dto.avatar));
                }
                club.setJoined(dto.isJoined);
                club.setMembers(dto.members);

                return club;
        }

        public static EventDTO toDTO(Event e) {
                EventDTO dto = new EventDTO();
                dto.id = e.getId();
                dto.title = e.getTitle();
                dto.description = e.getDescription();
                dto.date = e.getDate() != null ? LocalDate.parse(e.getDate().toString()) : null;
                dto.time = e.getTime();
                dto.location = e.getLocation();
                dto.createdAt = e.getCreatedAt();
                dto.status = e.getStatus();
                dto.clubId = e.getClub() != null ? e.getClub().getId() : null;
                dto.attendeesCount = e.getAttendees() != null ? e.getAttendees().size() : 0;
                dto.club = e.getClub() != null ? toSummaryDTO(e.getClub()) : null;
                return dto;
        }

        public static PostDTO toDTO(Post p) {
                return toDTO(p, null);
        }

        public static PostDTO toDTO(Post p, UUID userId) {
                PostDTO dto = new PostDTO();
                dto.id = p.getId();
                dto.authorId = p.getAuthor() != null ? p.getAuthor().getId() : null;
                dto.content = p.getContent();
                dto.likes = p.getLikes();
                dto.comments = p.getComments();
                dto.bookmarks = p.getBookmarks();
                dto.shares = p.getShares();
                dto.time = p.getTime();
                dto.photo = p.getPhoto();

                dto.poll = p.getPoll() != null ? toDTO(p.getPoll()) : null;
                dto.commentsList = p.getCommentsList().stream().map(c -> toDTO(c, userId)).toList();
                dto.club = p.getClub() != null ? toSummaryDTO(p.getClub()) : null;
                dto.liked = userId != null && p.getLikedBy().stream().anyMatch(u -> u.getId().equals(userId));
                return dto;
        }

	public static PollDTO toDTO(Poll poll) {
		PollDTO dto = new PollDTO();
		dto.question = poll.getQuestion();
		dto.options = poll.getOptions().stream().map(ClubMapper::toDTO).toList();
		return dto;
	}

	public static PollOptionDTO toDTO(PollOption opt) {
		PollOptionDTO dto = new PollOptionDTO();
		dto.text = opt.getText();
		dto.votes = opt.getVotes();
		return dto;
	}

        public static CommentDTO toDTO(Comment c) {
                return toDTO(c, null);
        }

        public static CommentDTO toDTO(Comment c, UUID userId) {
                CommentDTO dto = new CommentDTO();
                dto.id = c.getId();
                dto.author = c.getAuthor();
                dto.content = c.getContent();
                dto.time = c.getTime();
                dto.likes = c.getLikes();
                dto.liked = userId != null && c.getLikedBy().stream().anyMatch(u -> u.getId().equals(userId));
                return dto;
        }

        public static MemberDTO toDTO(Member m) {
                MemberDTO dto = new MemberDTO();
                dto.id = m.getId();
                dto.clubId = m.getClub() != null ? m.getClub().getId() : null;
                dto.role = m.getRole() != null ? m.getRole().name() : null;
                dto.avatar = (m.getUser() != null && m.getUser().getAvatar() != null)
                                ? Base64.getEncoder().encodeToString(m.getUser().getAvatar())
                                : null;
                dto.joinedAt = m.getJoinedAt();

                if (m.getUser() != null) {
                        dto.name = m.getUser().getUsername();
                }

		return dto;
	}

	public static ForumThreadDTO toDTO(ForumThread t) {
		ForumThreadDTO dto = new ForumThreadDTO();
                dto.id = t.getId();
                dto.title = t.getTitle();
                dto.authorId = t.getAuthor() != null ? t.getAuthor().getId() : null;
                dto.replies = t.getReplies();
                dto.lastActivity = t.getLastActivity();
                dto.content = t.getContent();
                dto.posts = t.getPosts().stream().map(ClubMapper::toDTO).toList();
                return dto;
	}
}
