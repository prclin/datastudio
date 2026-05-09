package io.github.prclin.datastudio.server.application.dto;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseBody<T> {
    private int code;
    private String message;
    @JsonInclude
    private T data;

    public static <T> ResponseBody<T> of(HttpStatus status, String message, T data) {
        return new ResponseBody<>(status.value(), message, data);
    }

    public static <T> ResponseBody<T> of(HttpStatus status, T data) {
        return new ResponseBody<>(status.value(), status.getReasonPhrase(), data);
    }

    public static <T> ResponseBody<T> ok() {
        return ok((T) null);
    }

    public static <T> ResponseBody<T> ok(T data) {
        return of(HttpStatus.OK, data);
    }

    public static <T> ResponseBody<T> ok(String message, T data) {
        return of(HttpStatus.OK, message, data);
    }

    public static <T> ResponseBody<T> ok(String message) {
        return ok(message, null);
    }

    public static <T> ResponseBody<T> clientError() {
        return clientError((T) null);
    }

    public static <T> ResponseBody<T> clientError(T data) {
        return of(HttpStatus.BAD_REQUEST, data);
    }

    public static <T> ResponseBody<T> clientError(String message, T data) {
        return of(HttpStatus.BAD_REQUEST, message, data);
    }

    public static <T> ResponseBody<T> clientError(String message) {
        return clientError(message, null);
    }

    public static <T> ResponseBody<T> serverError() {
        return serverError((T) null);
    }

    public static <T> ResponseBody<T> serverError(T data) {
        return of(HttpStatus.INTERNAL_SERVER_ERROR, data);
    }

    public static <T> ResponseBody<T> serverError(String message, T data) {
        return of(HttpStatus.INTERNAL_SERVER_ERROR, message, data);
    }

    public static <T> ResponseBody<T> serverError(String message) {
        return serverError(message, null);
    }


}
