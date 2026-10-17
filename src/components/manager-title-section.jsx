export function MtitleSection ({title}) {
  return (
    <h3 className="bg-primary w-fit px-2 uppercase font-bold text-sm">{title}</h3>
  )
}

export function MsubtitleSection ({subtitle}) {
  return (
    <p className="text-primary w-fit px-2 uppercase font-medium text-sm">{subtitle}</p>
  )
}