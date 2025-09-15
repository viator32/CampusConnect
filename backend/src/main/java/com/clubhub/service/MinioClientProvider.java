package com.clubhub.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Produces;
import jakarta.inject.Singleton;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.minio.MinioClient;

@ApplicationScoped
public class MinioClientProvider {

	@ConfigProperty(name = "minio.endpoint")
	String endpoint;

	@ConfigProperty(name = "minio.access-key")
	String accessKey;

	@ConfigProperty(name = "minio.secret-key")
	String secretKey;

	@Produces
	@Singleton
	public MinioClient minioClient() {
		return MinioClient.builder()
				.endpoint(endpoint)
				.credentials(accessKey, secretKey)
				.build();
	}
}
