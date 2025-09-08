package com.clubhub.resource;

import org.jboss.resteasy.reactive.RestForm;

/**
 * Form data for creating a post with optional picture.
 * The <code>picture</code> field contains the raw bytes and
 * <code>pictureContentType</code> provides its MIME type.
 */
public class PostCreateForm {

    @RestForm
    public String content;

    @RestForm
    public byte[] picture;

    @RestForm
    public String pictureContentType;
}

