export function PublicFooter() {
  return (
    <footer className="w-full border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
      <div className="container mx-auto max-w-6xl px-4">
        <p>© {new Date().getFullYear()} Tomás Fotografía. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
