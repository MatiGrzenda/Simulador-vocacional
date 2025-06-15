import { Ollama } from "@llamaindex/ollama";
import { Settings } from "llamaindex";
import readline from "readline";

// Configura el modelo Ollama
// Asegúrate de tener el modelo descargado y corriendo en tu máquina
// Baja ollama  de https://ollama.com/ 
// corre el siguiente comando en la terminal: `ollama run gemma3:1b`
const ollamaLLM = new Ollama({
  model: "gemma3:4b", // Cambia el modelo si lo deseas por ejemplo : "mistral:7b", "llama2:7b", etc.
  temperature: 0.75,
});

// Asigna Ollama como LLM y modelo de embeddings
Settings.llm = ollamaLLM;
Settings.embedModel = ollamaLLM;

// Función principal del programa
async function main() {

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let history = [
    {
      role: "system",
      content: "Eres un agente virtual cuyo propósito es ayudar a la gente a definir su trayectoria educativa o laboral. Debes hacer al menos 3 preguntas abiertas sobre gustos, intereses y preferencias personales, para luego sugerir al menos 2 posibilidades de estudios en base a los datos del usuario. No hagas más preguntas que las necesarias para hacer recomendaciones de carreras. Tienes que mantener un tono amable y claro en todo momento."
    },
  ]

  console.log("🤖 Bot con IA (Ollama) iniciado.");
  console.log("Escribí tu pregunta o poné 'salir' para terminar:");

  // Escuchamos cada vez que el usuario escribe algo
  rl.on("line", async (input) => {
    if (input.toLowerCase() === "salir") {
      rl.close(); // Cerramos el programa si escribió "salir"
      return;
    }

    // Guardamos la pregunta del usuario
    history.push({ role: "user", content: input });

    try {
      // Enviamos la conversación al modelo de IA usando Ollama
      const res = await ollamaLLM.chat({ messages: history });

      // Guardamos la respuesta del LLM
      history.push(res.message);

      // Obtenemos el texto de la respuesta
      const respuesta = res?.message?.content || res?.message || "";

      // Mostramos la respuesta en consola
      console.log("🤖 IA:", respuesta.trim());
    } catch (err) {
      // Si hay un error lo mostramos
      console.error("⚠️ Error al llamar al modelo:", err);
    }

    console.log("\nPreguntá otra cosa o escribí 'salir':");
  });
}

// Ejecutamos la función principal
main();
