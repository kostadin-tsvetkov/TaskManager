package com.pu.TaskManager.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public class GenericService<T, TRepo extends JpaRepository<T, Integer>> {

    @Autowired
    protected TRepo repository;

    public T save(T object) {
        return repository.save(object);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }

    public List<T> getAll() {
        return repository.findAll();
    }

    public T getById(Integer id) {
        Optional<T> result = repository.findById(id);
        return result.orElse(null);
    }
}
