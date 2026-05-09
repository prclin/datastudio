package io.github.prclin.datastudio.server.facade.http;

import lombok.AllArgsConstructor;
import org.springframework.boot.info.BuildProperties;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

import java.util.List;

@RestController
@RequestMapping("/jupyter/api")
@AllArgsConstructor
public class JupyterController {
    private final BuildProperties buildProperties;
    private final ObjectMapper objectMapper;

    @GetMapping("")
    public String getVersion() {
        return buildProperties.getVersion();
    }

    @GetMapping("/kernels")
    public List<String> getKernels() {
        return List.of();
    }

    @GetMapping("/sessions")
    public List<String> getSessions() {
        return List.of();
    }

    @GetMapping("/kernelspecs")
    public ObjectNode getKernelSpecs() {
        ObjectNode all = objectMapper.createObjectNode();
        all.put("default", "flink");
        ObjectNode specs = objectMapper.createObjectNode();
        String spec = """
                {
                "argv": [
                  "java",
                  "-jar",
                  "{resource_dir}/jupyter-kernel-flink-sql-1.0.0-all.jar",
                  "{connection_file}"
                ],
                "env": {
                },
                "display_name": "Flink Sql",
                "language": "fsql",
                "interrupt_mode": "message",
                "metadata": {
                },
                "kernel_protocol_version": ""
                }""";
        specs.set("flink", objectMapper.createObjectNode().put("name", "flink").set("spec", objectMapper.readTree(spec)).set("resources", objectMapper.createObjectNode()));
        all.set("kernelspecs", specs);
        return all;
    }
}
