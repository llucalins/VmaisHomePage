package br.com.vmais.agenda.config;

import java.time.Instant;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {
  @ExceptionHandler(ResponseStatusException.class)
  ResponseEntity<ApiErrorResponse> handleResponseStatus(ResponseStatusException exception) {
    int status = exception.getStatusCode().value();
    String message = exception.getReason() == null || exception.getReason().isBlank()
        ? "Nao foi possivel concluir a requisicao."
        : exception.getReason();

    return ResponseEntity
        .status(exception.getStatusCode())
        .body(new ApiErrorResponse(status, message, Instant.now()));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
    String message = exception.getBindingResult().getFieldErrors().stream()
        .map(error -> "%s: %s".formatted(error.getField(), error.getDefaultMessage()))
        .collect(Collectors.joining("; "));

    if (message.isBlank()) {
      message = "Dados invalidos. Revise os campos e tente novamente.";
    }

    return ResponseEntity
        .status(HttpStatus.BAD_REQUEST)
        .body(new ApiErrorResponse(HttpStatus.BAD_REQUEST.value(), message, Instant.now()));
  }

  public record ApiErrorResponse(int status, String message, Instant timestamp) {
  }
}
