package com.pu.TaskManager.controller;

import com.pu.TaskManager.entity.User;
import com.pu.TaskManager.service.impl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserService service;

    @GetMapping(path = "/allUsers")
    public List<User> getAllUsers() {
        return service.getAll();
    }

    @GetMapping(path = "/user")
    public User getUser(@RequestParam Integer id) {
        return service.getById(id);
    }

    @PostMapping(path = "/user")
    public User createUser(@RequestBody User user) {
        return service.save(user);
    }

    @PutMapping(path = "/user")
    public User updateUser(@RequestBody User user) {
        return service.save(user);
    }

    @DeleteMapping(path = "/user")
    public void deleteUser(@RequestParam Integer id) {
        service.delete(id);
    }
}
