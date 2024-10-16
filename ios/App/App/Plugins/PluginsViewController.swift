//
//  PluginsViewController.swift
//  App
//
//  Created by Víctor Peña Romero on 16/10/24.
//

import Foundation
import Capacitor

@objc(PluginsViewController)
class PluginsViewController: CAPBridgeViewController {
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }
    
    override open func capacitorDidLoad() {
        bridge?.registerPluginInstance(SafeAreaPlugin())
    }
}
