package com.blogrestapi.DTO;




import com.blogrestapi.Entity.Role;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Integer id;

    @NotEmpty(message = "Required!")
    private String username;

    @NotEmpty(message = "Required!")
    @Email(message = "Invalid email format")
    private String email;

    @NotEmpty(message = "Required!")
    @Size(min=3,max=16,message = "Password should have less than 3 and greater than 16 characters")
    private String password;
    private String image;
    @NotEmpty(message = "Required!")
    @Pattern(regexp = "^\\d{10}$",message = "Phone number must  have 10 digits")
    private String phoneNumber;
    @Size(min=10,max=600,message = "Description must be between 10 and 500 characters if provided")
    private String description;
    private boolean isEnable;

    private Role role;

    @JsonIgnore
    public String getPassword(){
        return this.password;
    }
    @JsonProperty
    public void setPassword(String password)
    {
        this.password=password;
    }
}
