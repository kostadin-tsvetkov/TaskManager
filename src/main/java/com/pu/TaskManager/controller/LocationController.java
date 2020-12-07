package com.pu.TaskManager.controller;

import com.pu.TaskManager.entity.Location;
import com.pu.TaskManager.service.impl.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class LocationController {

    @Autowired
    private LocationService service;

    @GetMapping(path = "/allLocations")
    public List<Location> getAllLocations() {
        return service.getAll();
    }

    @GetMapping(path = "/location")
    public Location getLocation(@RequestParam Integer id) {
        return service.getById(id);
    }

    @PostMapping(path = "/location")
    public Location createLocation(@RequestBody Location location) {
        return service.save(location);
    }

    @PutMapping(path = "/location")
    public Location updateLocation(@RequestBody Location location) {
        return service.save(location);
    }

    @DeleteMapping(path = "/location")
    public void deleteLocation(@RequestParam Integer id) {
        service.delete(id);
    }
}
