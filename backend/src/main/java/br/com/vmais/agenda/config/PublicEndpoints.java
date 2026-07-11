package br.com.vmais.agenda.config;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

public final class PublicEndpoints {
  private static final RequestMatcher[] MATCHERS = {
      new AntPathRequestMatcher("/**", HttpMethod.OPTIONS.name()),
      new AntPathRequestMatcher("/api/auth/login"),
      new AntPathRequestMatcher("/api/contact-messages", HttpMethod.POST.name())
  };

  private PublicEndpoints() {
  }

  public static RequestMatcher[] matchers() {
    return MATCHERS.clone();
  }

  public static boolean matches(HttpServletRequest request) {
    return Arrays.stream(MATCHERS).anyMatch(matcher -> matcher.matches(request));
  }
}
