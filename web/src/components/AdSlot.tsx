// Placeholder ad unit. Once the AdSense account is approved, replace the
// contents with the real <ins class="adsbygoogle"> snippet + publisher ID.
export default function AdSlot() {
  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) return null;

  return (
    <div className="my-6 border border-dashed border-neutral-300 rounded-lg p-4 text-center text-xs text-neutral-400">
      Espacio publicitario
    </div>
  );
}
