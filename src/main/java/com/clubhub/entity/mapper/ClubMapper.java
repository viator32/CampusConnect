package com.clubhub.entity.mapper;

import java.time.LocalDate;
import java.util.UUID;

import com.clubhub.entity.Club;
import com.clubhub.entity.Comment;
import com.clubhub.entity.Event;
import com.clubhub.entity.ForumThread;
import com.clubhub.entity.Member;
import com.clubhub.entity.Poll;
import com.clubhub.entity.PollOption;
import com.clubhub.entity.Post;
import com.clubhub.entity.Reply;
import com.clubhub.entity.dto.ClubDTO;
import com.clubhub.entity.dto.CommentDTO;
import com.clubhub.entity.dto.EventDTO;
import com.clubhub.entity.dto.ForumThreadDTO;
import com.clubhub.entity.dto.MemberDTO;
import com.clubhub.entity.dto.PollDTO;
import com.clubhub.entity.dto.PollOptionDTO;
import com.clubhub.entity.dto.PostDTO;
import com.clubhub.entity.dto.ReplyDTO;
import com.clubhub.service.ObjectStorageService;

public class ClubMapper {

	public static ClubDTO toDTO(Club club) {
		return toDTO(club, null);
	}

	public static ClubDTO toDTO(Club club, UUID userId) {
		ClubDTO dto = toSummaryDTO(club);

		dto.getEvents().addAll(club.getEvents().stream().map(ClubMapper::toDTO).toList());
		dto.getMembersList().addAll(club.getMembersList().stream().map(ClubMapper::toDTO).toList());
		dto.getForumThreads().addAll(club.getForumThreads().stream().map(t -> ClubMapper.toDTO(t, userId)).toList());

		return dto;
	}

	public static ClubDTO toSummaryDTO(Club club) {
		ClubDTO dto = new ClubDTO();
		dto.setId(club.getId());
		dto.setName(club.getName());
		dto.setDescription(club.getDescription());
		dto.setCategory(club.getCategory());
		dto.setSubject(club.getSubject());
		dto.setInterest(club.getInterest());
		dto.setLocation(club.getLocation());
		dto.setAvatar(ObjectStorageService.url(club.getAvatarBucket(), club.getAvatarObject()));
		dto.setJoined(club.isJoined());
		dto.setMembers(club.getMembersList() != null ? club.getMembersList().size() : 0);
		dto.setEventsCount(club.getEvents() != null ? club.getEvents().size() : 0);
		dto.setPostsCount(club.getPosts() != null ? club.getPosts().size() : 0);
		return dto;
	}

	public static Club toEntity(ClubDTO dto) {
		Club club = new Club();

		if (dto.getId() != null) {
			club.setId(dto.getId());
		}

		club.setName(dto.getName());
		club.setDescription(dto.getDescription());
		club.setCategory(dto.getCategory());
		club.setSubject(dto.getSubject());
		club.setInterest(dto.getInterest());
		club.setLocation(dto.getLocation());
		// avatar handled separately
		club.setJoined(dto.isJoined());
		club.setMembers(dto.getMembers());

		return club;
	}

	public static EventDTO toDTO(Event e) {
		EventDTO dto = new EventDTO();
		dto.setId(e.getId());
		dto.setTitle(e.getTitle());
		dto.setDescription(e.getDescription());
		dto.setDate(e.getDate() != null ? LocalDate.parse(e.getDate().toString()) : null);
		dto.setTime(e.getTime());
		dto.setLocation(e.getLocation());
		dto.setCreatedAt(e.getCreatedAt());
		dto.setStatus(e.getStatus());
		dto.setClubId(e.getClub() != null ? e.getClub().getId() : null);
		dto.setAttendeesCount(e.getAttendees() != null ? e.getAttendees().size() : 0);
		dto.setClub(e.getClub() != null ? toSummaryDTO(e.getClub()) : null);
		return dto;
	}

	public static PostDTO toDTO(Post p) {
		return toDTO(p, null);
	}

	public static PostDTO toDTO(Post p, UUID userId) {
		PostDTO dto = new PostDTO();
		dto.setId(p.getId());
		dto.setAuthor(p.getAuthor() != null ? UserMapper.toAuthorDTO(p.getAuthor()) : null);
		dto.setContent(p.getContent());
		dto.setLikes(p.getLikes());
		dto.setComments(p.getComments());
		dto.setBookmarks(p.getBookmarks());
		dto.setShares(p.getShares());
		dto.setTime(p.getTime());
		dto.setPicture(ObjectStorageService.url(p.getPictureBucket(), p.getPictureObject()));

		dto.setPoll(p.getPoll() != null ? toDTO(p.getPoll()) : null);
		dto.getCommentsList().addAll(p.getCommentsList().stream().map(c -> toDTO(c, userId)).toList());
		dto.setClub(p.getClub() != null ? toSummaryDTO(p.getClub()) : null);
		dto.setLiked(userId != null && p.getLikedBy().stream().anyMatch(u -> u.getId().equals(userId)));
		return dto;
	}

	public static PollDTO toDTO(Poll poll) {
		PollDTO dto = new PollDTO();
		dto.setQuestion(poll.getQuestion());
		dto.getOptions().addAll(poll.getOptions().stream().map(ClubMapper::toDTO).toList());
		return dto;
	}

	public static PollOptionDTO toDTO(PollOption opt) {
		PollOptionDTO dto = new PollOptionDTO();
		dto.setText(opt.getText());
		dto.setVotes(opt.getVotes());
		return dto;
	}

	public static CommentDTO toDTO(Comment c) {
		return toDTO(c, null);
	}

        public static CommentDTO toDTO(Comment c, UUID userId) {
                CommentDTO dto = new CommentDTO();
                dto.setId(c.getId());
                dto.setAuthor(c.getAuthor() != null ? UserMapper.toAuthorDTO(c.getAuthor()) : null);
                dto.setContent(c.getContent());
                dto.setTime(c.getTime());
                dto.setLikes(c.getLikes());
                dto.setLiked(userId != null && c.getLikedBy().stream().anyMatch(u -> u.getId().equals(userId)));
                return dto;
        }

        public static ReplyDTO toDTO(Reply r, UUID userId) {
                ReplyDTO dto = new ReplyDTO();
                dto.setId(r.getId());
                dto.setAuthor(r.getAuthor() != null ? UserMapper.toAuthorDTO(r.getAuthor()) : null);
                dto.setContent(r.getContent());
                dto.setTime(r.getTime());
                dto.setUpvotes(r.getUpvotes());
                dto.setDownvotes(r.getDownvotes());
                dto.setUpvoted(userId != null && r.getUpvotedBy().stream().anyMatch(u -> u.getId().equals(userId)));
                dto.setDownvoted(userId != null && r.getDownvotedBy().stream().anyMatch(u -> u.getId().equals(userId)));
                return dto;
        }

	public static MemberDTO toDTO(Member m) {
		MemberDTO dto = new MemberDTO();
		dto.setId(m.getId());
		dto.setClubId(m.getClub() != null ? m.getClub().getId() : null);
		dto.setUserId(m.getUser() != null ? m.getUser().getId() : null);
		dto.setRole(m.getRole() != null ? m.getRole().name() : null);
		dto.setAvatar((m.getUser() != null)
				? ObjectStorageService.url(m.getUser().getAvatarBucket(), m.getUser().getAvatarObject())
				: null);
		dto.setJoinedAt(m.getJoinedAt());

		if (m.getUser() != null) {
			dto.setName(m.getUser().getUsername());
		}

		return dto;
	}

	public static ForumThreadDTO toDTO(ForumThread t) {
		return toDTO(t, null);
	}

	public static ForumThreadDTO toDTO(ForumThread t, UUID userId) {
		ForumThreadDTO dto = new ForumThreadDTO();
		dto.setId(t.getId());
		dto.setTitle(t.getTitle());
		dto.setAuthor(t.getAuthor() != null ? UserMapper.toAuthorDTO(t.getAuthor()) : null);
                dto.setReplyCount(t.getReplyCount());
		dto.setLastActivity(t.getLastActivity());
		dto.setContent(t.getContent());
		dto.setUpvotes(t.getUpvotes());
		dto.setDownvotes(t.getDownvotes());
		dto.setUpvoted(userId != null && t.getUpvotedBy().stream().anyMatch(u -> u.getId().equals(userId)));
		dto.setDownvoted(userId != null && t.getDownvotedBy().stream().anyMatch(u -> u.getId().equals(userId)));
                dto.getReplies().addAll(t.getReplies().stream().map(r -> toDTO(r, userId)).toList());
		dto.setClub(t.getClub() != null ? toSummaryDTO(t.getClub()) : null);
		return dto;
	}
}
