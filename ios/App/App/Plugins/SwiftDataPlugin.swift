//
//  SwiftDataPlugin.swift
//  big
//
//  Created by Víctor Peña Romero on 18/10/24.
//

import Foundation
import Capacitor
import SwiftData

@objc(SwiftDataPlugin)
public class SwiftDataPlugin: CAPPlugin, CAPBridgedPlugin {
    
    private var container: ModelContainer?
    
    public let identifier = "SwiftDataPlugin"
    public let jsName = "SwiftDataPlugin"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "createDeck", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getAllDecks", returnType: CAPPluginReturnPromise)
    ]
    
    override public func load() {
        do {
            let schema = Schema([
                Deck.self,
                Card.self,
            ])
            
            let configuration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)
            container = try ModelContainer(for: schema, configurations: [configuration])
        } catch {
            print("Failed to load model container: \(error)")
        }
    }
    
    @MainActor
    @objc func createDeck(_ call: CAPPluginCall) {
        guard let name = call.getString("name"),
            let backgroundColor = call.getString("backgroundColor"),
            let color = call.getString("color"),
            let order = call.getInt("order") else {
                call.reject("Missing deck parameters")
                return
        }
        
        let detail = call.getString("detail") ?? ""
        
        guard let context = container?.mainContext else {
            call.reject("Failed to get main context")
            return
        }
        
        do {
            let newDeck = Deck(name: name, detail: detail, backgroundColor: backgroundColor, color: color, order: order)
            context.insert(newDeck)
            try context.save()
            call.resolve([
                "id": newDeck.id.uuidString,
                "name": newDeck.name,
                "detail": newDeck.detail ?? "",
                "backgroundColor": newDeck.color,
                "color": newDeck.color,
                "order": newDeck.order,
            ])
        } catch {
            call.reject("Failed to save deck: \(error.localizedDescription)")
        }
        
    }
    
    @MainActor
    @objc func getAllDecks(_ call: CAPPluginCall) {
        guard let context = container?.mainContext else {
            call.reject("Failed to get main context")
            return
        }
        
        do {
            let descriptor = FetchDescriptor<Deck>(sortBy: [SortDescriptor(\.order)])
            let decks = try context.fetch(descriptor)
            
            let decksData = decks.map { deck in
                [
                    "id": deck.id.uuidString,
                    "name": deck.name,
                    "detail": deck.detail ?? "",
                    "backgroundColor": deck.backgroundColor,
                    "color": deck.color,
                    "order": deck.order,
                ]
            }
            call.resolve(["decks": decksData])
        } catch {
            call.reject("Failed to fetch decks: \(error.localizedDescription)")
        }
    }
}
