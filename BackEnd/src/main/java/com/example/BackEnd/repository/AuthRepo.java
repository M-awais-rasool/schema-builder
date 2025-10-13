package com.example.BackEnd.repository;

import com.example.BackEnd.model.Users;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AuthRepo extends MongoRepository<Users, ObjectId> {
	Users findByEmail(String email);
}
