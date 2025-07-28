package com.clubhub.entity.mapper;

import java.time.LocalDate;

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
		ClubDTO dto = new ClubDTO();
		dto.id = club.getId();
		dto.name = club.getName();
		dto.description = club.getDescription();
		dto.category = club.getCategory();
		dto.image = club.getImage();
		dto.isJoined = club.isJoined();
		dto.members = club.getMembers();

		dto.events = club.getEvents().stream().map(ClubMapper::toDTO).toList();
		dto.posts = club.getPosts().stream().map(ClubMapper::toDTO).toList();
		dto.members_list = club.getMembersList().stream().map(ClubMapper::toDTO).toList();
		dto.forum_threads = club.getForumThreads().stream().map(ClubMapper::toDTO).toList();

		return dto;
	}

	public static Club toEntity(ClubDTO dto) {
		Club club = new Club();

		// id nur setzen, wenn sie vorhanden ist (z. B. bei PUT)
		if (dto.id != null) {
			club.setId(dto.id);
		}

		club.setName(dto.name);
		club.setDescription(dto.description);
		club.setCategory(dto.category);
		club.setImage(dto.image);
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
		return dto;
	}

	public static PostDTO toDTO(Post p) {
		PostDTO dto = new PostDTO();
		dto.id = p.getId();
		dto.author = p.getAuthor();
                dto.content = p.getContent();
                dto.likes = p.getLikes();
                dto.comments = p.getComments();
                dto.bookmarks = p.getBookmarks();
                dto.shares = p.getShares();
                dto.time = p.getTime();
                dto.photo = p.getPhoto();

		dto.poll = p.getPoll() != null ? toDTO(p.getPoll()) : null;
		dto.commentsList = p.getCommentsList().stream().map(ClubMapper::toDTO).toList();
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
		CommentDTO dto = new CommentDTO();
		dto.id = c.getId();
		dto.author = c.getAuthor();
		dto.content = c.getContent();
		dto.time = c.getTime();
		dto.likes = c.getLikes();
		return dto;
	}

        public static MemberDTO toDTO(Member m) {
                MemberDTO dto = new MemberDTO();
                dto.id = m.getId();
                dto.role = m.getRole();
                dto.avatar = m.getAvatar();
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
		dto.author = t.getAuthor();
		dto.replies = t.getReplies();
		dto.lastActivity = t.getLastActivity();
		dto.content = t.getContent();
		dto.posts = t.getPosts().stream().map(ClubMapper::toDTO).toList();
		return dto;
	}
}
