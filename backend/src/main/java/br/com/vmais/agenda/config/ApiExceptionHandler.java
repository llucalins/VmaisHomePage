package br.com.vmais.agenda.config;

import java.time.Instant;
import org.springframework.http.ResponseEntity;
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

  public record ApiErrorResponse(int status, String message, Instant timestamp) {
  }
}
