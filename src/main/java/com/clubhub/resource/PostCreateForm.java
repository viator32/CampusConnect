package com.clubhub.resource;

import org.jboss.resteasy.reactive.RestForm;

/**
 * Form data for creating a post with optional picture.
 * The <code>picture</code> field contains the raw bytes and
 * <code>pictureContentType</code> provides its MIME type.
 */
public class PostCreateForm {

    @RestForm
    private String content;

    @RestForm
    private byte[] picture;

    @RestForm
    private String pictureContentType;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public byte[] getPicture() {
        return picture;
    }

    public void setPicture(byte[] picture) {
        this.picture = picture;
    }

    public String getPictureContentType() {
        return pictureContentType;
    }

    public void setPictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
    }
}

