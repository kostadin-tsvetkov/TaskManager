package com.pu.TaskManager.service.impl;

import com.pu.TaskManager.entity.Task;
import com.pu.TaskManager.repository.TaskRepository;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService extends GenericService<Task, TaskRepository> {

    @Autowired
    private UserService userService;

    @Autowired
    private LocationService locationService;

    @Override
    public Task save(Task object) {
        object.setUser(userService.getById(object.getUser().getId()));
        object.setLocation(locationService.getById(object.getLocation().getId()));
        return super.save(object);
    }

    public List<Task> getFilteredTasks(Integer userId, String country) {
        List<Task> tasks = null;
        if (userId != null) {
            tasks = new ArrayList<>(userService.getById(userId).getTasks());
        }

        if (Strings.isNotBlank(country)) {
            if (tasks == null) {
                tasks = getAll();
            }
            tasks = tasks.stream().filter(task -> task.getLocation().getCountry().equals(country)).collect(Collectors.toList());
        }

        return tasks;
    }
}
