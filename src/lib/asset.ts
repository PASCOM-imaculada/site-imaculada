const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Prefixa caminhos locais com o basePath (necessário no GitHub Pages)
export function asset(path: string) {
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}
