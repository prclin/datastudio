package io.github.prclin.datastudio.server.application.cqrs.query;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public abstract class CommonQuery {
    public record Pagination(@NotNull @Min(1) Integer page, @NotNull @Min(1) Integer size) {
        public int offset() {
            return (page - 1) * size;
        }

        public int getOffset() {
            return offset();
        }
    }
}
