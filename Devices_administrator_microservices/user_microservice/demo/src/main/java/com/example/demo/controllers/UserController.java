package com.example.demo.controllers;

import com.example.demo.dtos.UserDTO;
import com.example.demo.dtos.UserDetailsDTO;
import com.example.demo.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/users")
@Validated
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getPeople() {
        return ResponseEntity.ok(userService.findUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDetailsDTO> updateUser(@PathVariable UUID id, @Valid @RequestBody UserDetailsDTO userDetailsDTO) {
        UserDetailsDTO updatedUser = userService.updateUser(id, userDetailsDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody UserDetailsDTO User) {
        UUID id = userService.insert(User);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(id)
                .toUri();
        return ResponseEntity.created(location).build(); // 201 + Location header
    }

    // În UserController.java

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }



    @GetMapping("/{id}")
    public ResponseEntity<UserDetailsDTO> getUser(@PathVariable UUID id) {
        return ResponseEntity.ok(userService.findUserById(id));
    }

}
