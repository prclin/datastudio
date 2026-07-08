package io.github.prclin.datastuio.common.assembler;


import jakarta.annotation.Resource;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

import java.util.Map;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public abstract class BaseAssembler {
    @Resource
    protected ObjectMapper objectMapper;

    public JsonNode mapNode(String value) {
        return value == null ? null : objectMapper.readTree(value);
    }

    public String mapNode(JsonNode node) {
        return node == null || node.isNull() ? null : node.toString();
    }

    public ObjectNode mapObject(String value) {
        return value == null ? null : (ObjectNode) objectMapper.readTree(value);
    }

    public String mapObject(ObjectNode node) {
        return node == null || node.isNull() ? null : node.toString();
    }

    public JsonNode deepCopyNode(JsonNode node) {
        return node == null ? null : node.deepCopy();
    }

    public ObjectNode deepCopyNode(ObjectNode node) {
        return node == null ? null : node.deepCopy();
    }

    public ObjectNode map2ObjectNode(Map<String, String> map) {
        return objectMapper.convertValue(map, ObjectNode.class);
    }
}
