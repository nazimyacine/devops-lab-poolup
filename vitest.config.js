/**
 * Vitest configuration.
 * Vitest ne lit pas la clé "vitest" de package.json : sans ce fichier,
 * les seuils de couverture ne sont jamais appliqués et la CI ne bloque rien.
 */
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      // index.js ne fait qu'ouvrir le port réseau : il n'est pas testable
      // sans lancer un vrai serveur, on l'exclut du calcul.
      exclude: ['src/index.js'],
      reporter: ['text', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80
      }
    }
  }
})
