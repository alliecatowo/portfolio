/**
 * Layout planning for the /projects mosaic.
 *
 * The grid has a known column count per container width (1-4, see the CSS in
 * pages/projects/index.vue), so every layout can be worked out ahead of time
 * and baked into classes: no measuring, no layout shift, same result on the
 * server and the client.
 *
 * For each column count we simulate CSS `grid-auto-flow: row dense` with the
 * preferred tile sizes (features 2x2 "bento" at four columns, 2x1 "wide" at
 * two or three). If that would strand an empty cell anywhere except a single
 * run at the end of the last row, features are shrunk one step at a time,
 * last first, until it doesn't. The trailing CTA tile then spans exactly the
 * leftover run (or a full row when there is none), so the grid ends flush.
 */

export type TileSize = 'single' | 'wide' | 'bento'
export type MosaicColumns = 2 | 3 | 4

export const MOSAIC_COLUMNS: MosaicColumns[] = [2, 3, 4]

export interface MosaicPlan {
  /** Per tile (same order as the input), the size at each column count. */
  sizes: Record<MosaicColumns, TileSize>[]
  /** Columns the trailing filler tile spans at each column count. */
  fill: Record<MosaicColumns | 1, number>
}

const dims: Record<TileSize, [number, number]> = {
  single: [1, 1],
  wide: [2, 1],
  bento: [2, 2]
}

const smaller: Record<TileSize, TileSize> = { bento: 'wide', wide: 'single', single: 'single' }

/** Dense auto-placement; returns the filler span, or null if it leaves a gap. */
function fillerSpan(sizes: TileSize[], cols: number): number | null {
  const grid: boolean[][] = []
  const free = (r: number, c: number) => !grid[r]?.[c]
  for (const size of sizes) {
    const [w, h] = dims[size]
    if (w > cols) return null
    let placed = false
    for (let r = 0; !placed; r++) {
      for (let c = 0; c + w <= cols && !placed; c++) {
        let fits = true
        for (let dr = 0; dr < h && fits; dr++) {
          for (let dc = 0; dc < w && fits; dc++) fits = free(r + dr, c + dc)
        }
        if (!fits) continue
        for (let dr = 0; dr < h; dr++) {
          grid[r + dr] ??= []
          for (let dc = 0; dc < w; dc++) grid[r + dr]![c + dc] = true
        }
        placed = true
      }
    }
  }
  const rows = grid.length
  if (rows === 0) return cols
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols; c++) if (free(r, c)) return null
  }
  // Last row: the empty cells must be one contiguous run for the filler.
  const empty = [...Array(cols).keys()].filter(c => free(rows - 1, c))
  if (empty.length === 0) return cols
  const contiguous = empty[empty.length - 1]! - empty[0]! + 1 === empty.length
  return contiguous ? empty.length : null
}

export function planMosaic(features: boolean[]): MosaicPlan {
  const sizes = features.map(() => ({ 2: 'single', 3: 'single', 4: 'single' }) as Record<MosaicColumns, TileSize>)
  const fill = { 1: 1 } as MosaicPlan['fill']

  for (const cols of MOSAIC_COLUMNS) {
    const current: TileSize[] = features.map(f => (f ? (cols === 4 ? 'bento' : 'wide') : 'single'))
    let span = fillerSpan(current, cols)
    // Shrink features from the end until the packing is clean.
    while (span === null) {
      const i = current.findLastIndex(s => s !== 'single')
      if (i === -1) break
      current[i] = smaller[current[i]!]
      span = fillerSpan(current, cols)
    }
    current.forEach((s, i) => { sizes[i]![cols] = s })
    fill[cols] = span ?? cols
  }
  return { sizes, fill }
}
