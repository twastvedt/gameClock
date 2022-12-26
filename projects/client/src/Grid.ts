/**
 *
 * @param tiles Number of tiles.
 * @param width Width of screen.
 * @param height Height of screen.
 * @param tileAspect Target tile width/height.
 * @returns [rows, columns]
 */
export function makeGrid(
  tiles: number,
  width: number,
  height: number,
  tileAspect = 1
): [number, number] {
  const gridAspect = width / height / tileAspect;

  const testRows = Math.round(tiles / 1);

  return [1, 1];
}
