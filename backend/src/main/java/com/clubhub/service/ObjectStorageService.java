package com.clubhub.service;

import java.io.ByteArrayInputStream;
import java.util.Map;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import org.eclipse.microprofile.config.ConfigProvider;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.minio.BucketExistsArgs;
import io.minio.MakeBucketArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.SetBucketPolicyArgs;

@ApplicationScoped
public class ObjectStorageService {

	@Inject
	MinioClient minioClient;

	@ConfigProperty(name = "minio.bucket")
	String bucket;

	private static final Map<String, String> EXTENSIONS = Map.of(
			"image/png", ".png",
			"image/jpeg", ".jpg",
			"image/jpg", ".jpg",
			"image/webp", ".webp",
			"image/gif", ".gif");

	public static String url(String bucket, String objectName) {
		if (bucket == null || objectName == null) {
			return null;
		}
		String publicUrl = ConfigProvider.getConfig().getValue("minio.public-url", String.class);
		return String.format("%s/%s/%s", publicUrl, bucket, objectName);
	}

	public StoredObject upload(String objectNamePrefix, byte[] data, String contentType) {
		return uploadTo(bucket, objectNamePrefix, data, contentType);
	}

	public StoredObject uploadTo(String targetBucket, String objectNamePrefix, byte[] data, String contentType) {
		String extension = EXTENSIONS.getOrDefault(contentType, "");
		String objectName = objectNamePrefix + extension;
		try (var stream = new ByteArrayInputStream(data)) {
			if (!minioClient.bucketExists(BucketExistsArgs.builder().bucket(targetBucket).build())) {
				minioClient.makeBucket(MakeBucketArgs.builder().bucket(targetBucket).build());

				String policy = String.format("""
						{
						  "Version": "2012-10-17",
						  "Statement": [
						    {
						      "Effect": "Allow",
						      "Principal": "*",
						      "Action": ["s3:GetObject"],
						      "Resource": ["arn:aws:s3:::%s/*"]
						    }
						  ]
						}
						""", targetBucket);

				minioClient.setBucketPolicy(SetBucketPolicyArgs.builder()
						.bucket(targetBucket)
						.config(policy)
						.build());
			}
			var response = minioClient.putObject(PutObjectArgs.builder()
					.bucket(targetBucket)
					.object(objectName)
					.stream(stream, data.length, -1)
					.contentType(contentType)
					.build());
			return new StoredObject(targetBucket, objectName, response.etag());
		} catch (Exception e) {
			throw new RuntimeException("Failed to upload object", e);
		}
	}

	public void delete(String objectName) {
		deleteFrom(bucket, objectName);
	}

	public void deleteFrom(String targetBucket, String objectName) {
		try {
			minioClient.removeObject(RemoveObjectArgs.builder()
					.bucket(targetBucket)
					.object(objectName)
					.build());
		} catch (Exception e) {
			throw new RuntimeException("Failed to delete object", e);
		}
	}

	public record StoredObject(String bucket, String objectKey, String etag) {
	}
}
