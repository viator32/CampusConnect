package com.clubhub.resource;

import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

/**
 * Form data for creating a post with optional photo.
 */
public class PostCreateForm {

    @RestForm
    public String content;

    @RestForm
    public FileUpload photo;
}

