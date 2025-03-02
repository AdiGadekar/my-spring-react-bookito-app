package com.endava.backend.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Data
@NoArgsConstructor(access = AccessLevel.PUBLIC)
public class ApiResponse<T> {
    private T body;//The actual data (could be any object)
}
