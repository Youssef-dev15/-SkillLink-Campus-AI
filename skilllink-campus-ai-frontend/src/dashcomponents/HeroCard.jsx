import "./herocard.css"
export default function HeroCard() {
  return (
    <div className="hero">
      <h1>Boostez votre apprentissage 🚀</h1>
      <p>Trouvez des partenaires d'étude...</p>

      <div className="hero-buttons">
        <button>Lancer un Match</button>
        <button className="outline">Demander à l'IA</button>
      </div>
    </div>
  );
}
