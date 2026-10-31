package io.github.prclin.gradle.common

import org.gradle.process.ExecOutput

class ExecUtils {
  static def print(ExecOutput output) {
    def std = output.standardOutput.asText.get()
    def err = output.standardError.asText.get()
    System.out.println("command exit with code:${output.result.get().exitValue}")
    if (!std.isEmpty()) System.out.println(std)
    if (!err.isEmpty()) {
      System.err.println(err)
      output.result.get().assertNormalExitValue()
    }
  }
}
