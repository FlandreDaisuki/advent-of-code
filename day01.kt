import java.nio.file.Paths
import java.io.File

class AOC2022 {
  companion object {
    @JvmStatic fun main(args: Array<String>) {
        val currentPath = AOC2022::class.java.protectionDomain.codeSource.location.path
        val questionPath = Paths.get(currentPath).getFileName().toString().replace(".jar", ".txt")
        val inputText: String = File(questionPath).readText()
        fun String.splitLines(delimiters: String = "\n") = this.split(delimiters).map{it.trim()}.filter{it.isNotEmpty()}

        val elvesWithFoods = inputText
          .splitLines("\n\n")
          .map { elf ->
            elf.splitLines()
               .map{ it.toIntOrNull() }
               .filterNotNull()
          }
        val elvesCalories = elvesWithFoods.map { it.sum() }
        println("answer1 ${elvesCalories.max()}")
    }
  }
}
