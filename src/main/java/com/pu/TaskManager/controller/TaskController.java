package com.pu.TaskManager.controller;

import com.pu.TaskManager.entity.Task;
import com.pu.TaskManager.service.impl.LocationService;
import com.pu.TaskManager.service.impl.TaskService;
import com.pu.TaskManager.service.impl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TaskController {

    @Autowired
    private TaskService service;

    @Autowired
    private UserService userService;

    @Autowired
    private LocationService locationService;

    @GetMapping(path = "/allTasks")
    public List<Task> getAllTasks() {
        return service.getAll();
    }

    @GetMapping(path = "/task")
    public Task getTask(@RequestParam Integer id) {
        return service.getById(id);
    }

    @PostMapping(path = "/task")
    public Task createTask(@RequestBody Task task) {
        return service.save(task);
    }

    @PutMapping(path = "/task")
    public Task updateTask(@RequestBody Task task) {
        return service.save(task);
    }

    @DeleteMapping(path = "/task")
    public void deleteTask(@RequestParam Integer id) {
        service.delete(id);
    }

    @GetMapping(path = "/task/filter")
    public List<Task> getFilteredTasks(@RequestParam(required = false) String userId, @RequestParam(required = false) String country) {
        if (userId != null) {
            return service.getFilteredTasks(Integer.parseInt(userId), country);
        }
        return service.getFilteredTasks(null, country);
    }
}
