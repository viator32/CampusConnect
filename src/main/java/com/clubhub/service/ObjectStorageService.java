package com.clubhub.service;

import java.io.ByteArrayInputStream;
import java.util.Map;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;

@ApplicationScoped
public class ObjectStorageService {

    @Inject
    MinioClient minioClient;

    @ConfigProperty(name = "minio.bucket")
    String bucket;

    @ConfigProperty(name = "minio.public-url")
    String publicUrl;

    private static final Map<String, String> EXTENSIONS = Map.of(
            "image/png", ".png",
            "image/jpeg", ".jpg",
            "image/jpg", ".jpg",
            "image/webp", ".webp",
            "image/gif", ".gif");

    public String upload(String objectNamePrefix, byte[] data, String contentType) {
        String extension = EXTENSIONS.getOrDefault(contentType, "");
        String objectName = objectNamePrefix + extension;
        try (var stream = new ByteArrayInputStream(data)) {
            if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucket).build())) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucket).build());
            }
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
