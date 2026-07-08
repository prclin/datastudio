package io.github.prclin.datastudio.server.infrastructure.configuration.converter;

import io.github.prclin.datastuio.common.enums.BaseEnum;
import org.apache.commons.lang3.math.NumberUtils;
import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;
import org.springframework.core.convert.converter.Converter;
import org.springframework.core.convert.converter.ConverterFactory;

public final class StringToEnumConverterFactory implements ConverterFactory<String, BaseEnum> {

    @Override
    @NonNull
    public <T extends BaseEnum> Converter<String, T> getConverter(@NonNull Class<T> targetType) {
        return new StringToEnum<>(targetType);
    }


    private record StringToEnum<T extends BaseEnum>(Class<T> enumType) implements Converter<String, T> {

        @Override
        @Nullable
        public T convert(String source) {
            if (source.isEmpty()) {
                // It's an empty enum identifier: reset the enum value to null.
                return null;
            }

            if (NumberUtils.isParsable(source)) {
                if (BaseEnum.class.isAssignableFrom(enumType)) {
                    for (T enumConstant : enumType.getEnumConstants()) {
                        byte value = enumConstant.getValue();
                        if (String.valueOf(value).equals(source)) return enumConstant;
                    }
                }
            }

            return null;
        }
    }
}
