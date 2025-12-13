package com.thejustdevme.demo.infrastructure.mongo;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface TaskEventMongoRepository extends MongoRepository<TaskEventDocument, String> {}
