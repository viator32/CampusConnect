package com.clubhub.service;

import java.io.ByteArrayInputStream;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;

@ApplicationScoped
public class ObjectStorageService {

    @Inject
    MinioClient minioClient;

    @ConfigProperty(name = "minio.bucket")
    String bucket;

    @ConfigProperty(name = "minio.public-url")
    String publicUrl;

    public String upload(String objectName, byte[] data, String contentType) {
        try (var stream = new ByteArrayInputStream(data)) {
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .stream(stream, data.length, -1)
                    .contentType(contentType)
                    .build());
            return String.format("%s/%s/%s", publicUrl, bucket, objectName);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload object", e);
        }
    }
}
