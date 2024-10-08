package com.blogrestapi.DTO;




import com.blogrestapi.Entity.Role;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
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


    // @JsonIgnore // password will not appear in the json field
    @NotEmpty(message = "Required!")
    private String password;
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
