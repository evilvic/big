import { getDeviceInfo } from '@/plugins/device';
import { IndexedDBController } from '@/data/indexedDBController'
import { SwiftDataController } from '@/plugins/swiftData'

export class DataControllerFactory {
  static instance = null;
  currentController = null
  initializing = false

  constructor() {}

  static getInstance() {
    if (!DataControllerFactory.instance) {
      DataControllerFactory.instance = new DataControllerFactory()
    }
    return DataControllerFactory.instance;
  }

  async getController() {
    if (this.initializing) {
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (this.currentController) {
            clearInterval(interval)
            resolve(this.currentController)
          }
        }, 100)
      })
    }

    if (this.currentController) {
      return this.currentController
    }

    this.initializing = true
    const { platform } = await getDeviceInfo()

    switch (platform) {
      case 'ios':
        this.currentController = new SwiftDataController()
        break
      default:
        this.currentController = new IndexedDBController()
        break
    }

    await this.currentController.initializeDB()
    this.initializing = false
    return this.currentController   
  }
}

