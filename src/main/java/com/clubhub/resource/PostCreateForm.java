package com.clubhub.resource;

import org.jboss.resteasy.reactive.RestForm;

/**
 * Form data for creating a post with optional photo.
 * The <code>photo</code> field contains the raw bytes and
 * <code>photoContentType</code> provides its MIME type.
 */
public class PostCreateForm {

    @RestForm
    public String content;

    @RestForm
    public byte[] photo;

    @RestForm
    public String photoContentType;
}

