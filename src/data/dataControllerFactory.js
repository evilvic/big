import { getDeviceInfo } from '@/plugins/device';
import { IndexedDBController } from '@/data/indexedDBController'
import { SwiftDataController } from '@/plugins/swiftData'

export class DataControllerFactory {
  static instance = null;
  currentController = null

  constructor() {}

  static getInstance() {
    if (!DataControllerFactory.instance) {
      DataControllerFactory.instance = new DataControllerFactory()
    }
    return DataControllerFactory.instance;
  }

  async getController() {
    if (this.currentContreller) {
      return this.currentController
    }

    const { platform } = await getDeviceInfo()

    switch (platform) {
      case 'ios':
        this.currentController = new SwiftDataController()
        break
      default:
        this.currentController = new IndexedDBController()
        break
    }

    return this.currentController   
  }
}

