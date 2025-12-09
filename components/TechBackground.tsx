interface ThemeConfig {
  mode?: 'dynamic' | 'image'
  backgroundImage?: string
}

export default function TechBackground({ theme }: { theme?: ThemeConfig }) {
  const isImageMode = theme?.mode === 'image' && !!theme?.backgroundImage

  return (
    <div className="tech-bg">
      {isImageMode ? (
        <>
          <div
            className="tech-bg__image"
            style={{
              backgroundImage: `url(${theme?.backgroundImage})`,
            }}
          />
          <div className="tech-bg__overlay" />
        </>
      ) : null}
    </div>
  )
}

