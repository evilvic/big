import { Device } from "@capacitor/device";

let deviceId = null
let deviceInfo = null

export const getDeviceId = async () => {
  if (deviceId === null) {
    deviceId = await Device.getId()
  }
  return await deviceId
}

export const getDeviceInfo = async () => {
  if (deviceInfo === null) {
    deviceInfo = await Device.getInfo()
  }
  return await deviceInfo
}

export const isIos = async () => {
  if (deviceInfo === null) {
    deviceInfo = await Device.getInfo()
  }
  return await deviceInfo.platform === 'ios'
}