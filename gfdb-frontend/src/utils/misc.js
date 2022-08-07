
export const distanceBetweenTwoPoints = (
    coords1,
    coords2
) => {
    return Math.sqrt(
        Math.pow(coords2.x - coords1.x, 2) + Math.pow(coords2.y - coords1.y, 2)
    )
}