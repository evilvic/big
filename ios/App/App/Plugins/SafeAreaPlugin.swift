//
//  SafeAreaPlugin.swift
//  App
//
//  Created by Víctor Peña Romero on 16/10/24.
//

import Foundation
import Capacitor

@objc(SafeAreaPlugin)
public class SafeAreaPlugin: CAPPlugin, CAPBridgedPlugin {
    
    public let identifier = "SafeAreaPlugin"
    public let jsName = "SafeAreaPlugin"
    public let pluginMethods: [CAPPluginMethod] = [
        
    ]
    
    @objc func getInsets(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let window = UIApplication.shared.windows.first else {
                call.reject("No window found")
                return
            }
            
            let insets = window.safeAreaInsets
            
            call.resolve([
                "top": insets.top,
                "bottom": insets.bottom,
                "left": insets.left,
                "right": insets.right
            ])
        }
    }
    
}
