type SectionTitleProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <div className="max-w-3xl">
      <div className="text-sm font-semibold text-cinnabar">{eyebrow}</div>
      <h2 className="mt-2 text-3xl font-semibold tracking-normal text-ink md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-8 text-graphite/80">{description}</p>
      ) : null}
    </div>
  );
}

