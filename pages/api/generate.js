import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key no configurado, sigue las instrucciones en README.md",
      }
    });
    return;
  }

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Por favor escribe un nombre",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // manejo de errores
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error con la solicitud de API de OpenAI: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'Ocurrió un error durante su solicitud.',
        }
      });
    }
  }
}

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Sugiere tres nombres de animales para que sea un superheroe.

Animal: Gato
Nombres: Capitan Garra afilada, Agente Bola de peluza, El Increible Felino
Animal: Perro
Nombres: The Protector, Maravilla Canina, Sir Ladramucho
Animal: ${capitalizedAnimal}
Nombres:`;
}
