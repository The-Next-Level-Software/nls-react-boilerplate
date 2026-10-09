/** Reads an image file as a data URL, rejecting files larger than `maxKb`. */
export function readImageFile(file: File, maxKb = 512): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) return reject(new Error('Please choose an image file'))
    if (file.size > maxKb * 1024) return reject(new Error(`Image must be smaller than ${maxKb} KB`))
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}
