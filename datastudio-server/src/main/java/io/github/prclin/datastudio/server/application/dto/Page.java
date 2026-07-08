package io.github.prclin.datastudio.server.application.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.function.Function;

@Data
@Builder
public class Page<T> {
    private Long total;
    private List<T> list;

    public static <T> Page<T> of(Long total, List<T> list) {
        return Page.<T>builder().total(total).list(list).build();
    }

    public static <T> Page<T> of(List<T> list) {
        return Page.of(null, list);
    }

    public <E> Page<E> map(Function<T, E> mapper) {
        List<E> list = this.list.stream().map(mapper).toList();
        return Page.of(this.total, list);
    }
}
