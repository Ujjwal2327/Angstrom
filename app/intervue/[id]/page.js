export default function IntervuePage({ params }) {
  params.id = decodeURIComponent(params.id);

  return <>Intervue Id - {params.id}</>;
}
