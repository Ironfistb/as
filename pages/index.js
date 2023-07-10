import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import Footer from './footer';

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Solicitud fallida del estado ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
    } catch(error) {
      // manejo de error aca
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Buscador de Supernombres</title>
        <link rel="icon" href="/super.png" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM" crossorigin="anonymous"/>        
      </Head>

      <main className={styles.main}>
        <img src="/super.png" className={styles.icon} />
        <h3>Generador de Supernombres</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Ingrese un nombre"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generar Supernombres" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
      <Footer />      
    </div>
  );
}
