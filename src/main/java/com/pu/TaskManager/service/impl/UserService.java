package com.pu.TaskManager.service.impl;

import com.pu.TaskManager.entity.User;
import com.pu.TaskManager.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService extends GenericService<User, UserRepository> {
}
