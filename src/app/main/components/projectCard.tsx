export default function ProjectCard({
  card,
  refresh,
}: {
  card: { id: string; title: string; description: string };
  refresh: () => void;
}) {
  return (
    <div>
      <h2>{card.title}</h2>
      <p>{card.description}</p>
      <button>Choose</button>
    </div>
  );
}
