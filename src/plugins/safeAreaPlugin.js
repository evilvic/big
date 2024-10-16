import { registerPlugin } from '@capacitor/core'

const SafeArea = registerPlugin('SafeAreaPlugin')

export async function getSafeAreaInsets() {
  return await SafeArea.getInsets()
}