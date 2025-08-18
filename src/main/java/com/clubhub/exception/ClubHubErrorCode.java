package com.clubhub.exception;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * Central place for error codes used across the application.
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public final class ClubHubErrorCode {

	/** Unique code for this module - used to build errors originating from this module. */
	public static final String MODULE_CODE = "CLB";

	/** User not found. */
	public static final String USER_NOT_FOUND = "CLB-00-0000-0001";

	/** Club not found. */
	public static final String CLUB_NOT_FOUND = "CLB-00-0000-0002";

	/** Post not found. */
	public static final String POST_NOT_FOUND = "CLB-00-0000-0003";

	/** User is not a member of the club. */
	public static final String USER_NOT_MEMBER_OF_CLUB = "CLB-00-0000-0004";

	/** User is already a member of the club. */
	public static final String ALREADY_MEMBER = "CLB-00-0000-0005";

	/** Invalid credentials provided. */
	public static final String INVALID_CREDENTIALS = "CLB-00-0000-0006";

	/** Comment not found. */
	public static final String COMMENT_NOT_FOUND = "CLB-00-0000-0007";

	/** Event not found. */
	public static final String EVENT_NOT_FOUND = "CLB-00-0000-0008";

	/** User already exists. */
	public static final String USER_ALREADY_EXISTS = "CLB-00-0000-0009";

	/** Member not found. */
	public static final String MEMBER_NOT_FOUND = "CLB-00-0000-0010";

	/** Insufficient permissions. */
	public static final String INSUFFICIENT_PERMISSIONS = "CLB-00-0000-0011";

	/** Last admin cannot leave. */
	public static final String LAST_ADMIN_LEAVE = "CLB-00-0000-0012";

        /** Last admin cannot change own role. */
        public static final String LAST_ADMIN_ROLE_CHANGE = "CLB-00-0000-0013";

        /** Invalid or expired token. */
        public static final String INVALID_TOKEN = "CLB-00-0000-0014";
}
