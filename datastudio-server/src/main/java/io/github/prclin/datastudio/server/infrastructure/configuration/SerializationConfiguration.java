package io.github.prclin.datastudio.server.infrastructure.configuration;


import io.github.prclin.datastuio.common.enums.BaseEnum;
import org.springframework.boot.jackson.autoconfigure.JsonMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.core.JacksonException;
import tools.jackson.core.JsonParser;
import tools.jackson.databind.BeanDescription;
import tools.jackson.databind.DeserializationConfig;
import tools.jackson.databind.DeserializationContext;
import tools.jackson.databind.JavaType;
import tools.jackson.databind.ValueDeserializer;
import tools.jackson.databind.deser.ValueDeserializerModifier;
import tools.jackson.databind.module.SimpleModule;

@Configuration
@SuppressWarnings("unchecked")
public class SerializationConfiguration {
    /**
     * jackson扩展配置
     */
    @Bean
    public JsonMapperBuilderCustomizer jsonCustomizer() {
        return builder -> {
            SimpleModule module = new SimpleModule();
            module.setDeserializerModifier(new ValueDeserializerModifier() {
                @Override
                public ValueDeserializer<?> modifyEnumDeserializer(
                        DeserializationConfig config,
                        JavaType type,
                        BeanDescription.Supplier beanDesc,
                        ValueDeserializer<?> deserializer) {
                    Class<?> enumClass = type.getRawClass();
                    if (!BaseEnum.class.isAssignableFrom(enumClass)) {
                        return deserializer;
                    }
                    return new BaseEnumDeserializer((Class<? extends BaseEnum>) enumClass);
                }
            });
            builder.addModule(module);
        };
    }

    public static class BaseEnumDeserializer extends ValueDeserializer<BaseEnum> {

        private final Class<? extends BaseEnum> enumClass;

        public BaseEnumDeserializer(Class<? extends BaseEnum> enumClass) {
            this.enumClass = enumClass;
        }

        @Override
        public BaseEnum deserialize(JsonParser p, DeserializationContext ctxt) throws JacksonException {
            byte byteValue = p.getByteValue();
            for (BaseEnum enumConstant : enumClass.getEnumConstants()) {
                if (byteValue == enumConstant.getValue()) return enumConstant;
            }
            return null;
        }
    }
}
