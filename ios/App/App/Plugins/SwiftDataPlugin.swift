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
        CAPPluginMethod(name: "initializeDB", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "createDeck", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getAllDecks", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getDeck", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "updateDeck", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "deleteDeck", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "createCard", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getCard", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getCardsByDeckId", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "updateCard", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "deleteCard", returnType: CAPPluginReturnPromise),
    ]
    
    @MainActor
    @objc func initializeDB(_ call: CAPPluginCall) {
        do {
            let schema = Schema([
                Deck.self,
                Card.self,
            ])
            
            let configuration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)
            container = try ModelContainer(for: schema, configurations: [configuration])
            call.resolve([ "status": "success"])
        } catch {
            call.reject("Failed to load model container \(error.localizedDescription)")
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
    
    @MainActor
    @objc func getDeck(_ call: CAPPluginCall) {
        guard let idString = call.getString("id"),
              let id = UUID(uuidString: idString),
              let context = container?.mainContext else {
            call.reject("Invalid ID or context not available")
            return
        }
            
        do {
            let descriptor = FetchDescriptor<Deck>(predicate: #Predicate<Deck> { deck in deck.id == id})
                
            if let deck = try context.fetch(descriptor).first {
                call.resolve([
                    "id": deck.id.uuidString,
                    "name": deck.name,
                    "detail": deck.detail ?? "",
                    "backgroundColor": deck.backgroundColor,
                    "color": deck.color,
                    "order": deck.order
                ])
            } else {
                call.reject("Deck not found")
            }
        } catch {
            call.reject("Failed to fetch deck: \(error.localizedDescription)")
        }
    }
    
    @MainActor
    @objc func updateDeck(_ call: CAPPluginCall) {
        guard let idString = call.getString("id"),
              let id = UUID(uuidString: idString),
              let context = container?.mainContext else {
            call.reject("Invalid ID or context not available")
            return
        }
            
        do {
            let descriptor = FetchDescriptor<Deck>(predicate: #Predicate<Deck> { deck in deck.id == id})
            
            guard let deck = try context.fetch(descriptor).first else {
                call.reject("Deck not found")
                return
            }
            
            if let name = call.getString("name") { deck.name = name }
            if let detail = call.getString("detail") { deck.detail = detail }
            if let backgroundColor = call.getString("backgroundColor") { deck.backgroundColor = backgroundColor }
            if let color = call.getString("color") { deck.color = color }
            if let order = call.getInt("order") { deck.order = order }
            deck.updatedAt = Date()
            
            try context.save()
            
            call.resolve([
                "id": deck.id.uuidString,
                "name": deck.name,
                "detail": deck.detail ?? "",
                "backgroundColor": deck.backgroundColor,
                "color": deck.color,
                "order": deck.order
            ])
        } catch {
            call.reject("Failed to update deck: \(error.localizedDescription)")
        }
    }
    
    @MainActor
    @objc func deleteDeck(_ call: CAPPluginCall) {
        guard let idString = call.getString("id"),
              let id = UUID(uuidString: idString),
              let context = container?.mainContext else {
            call.reject("Invalid ID or context not available")
            return
        }
            
        do {
            let descriptor = FetchDescriptor<Deck>(predicate: #Predicate<Deck> { deck in deck.id == id})
            
            guard let deck = try context.fetch(descriptor).first else {
                call.reject("Deck not found")
                return
            }
            
            deck.cards.removeAll()
            try context.save()
            
            context.delete(deck)
            try context.save()
            
            call.resolve()
        } catch {
            call.reject("Failed to delete deck: \(error.localizedDescription)")
        }
    }
    
    @MainActor
    @objc func createCard(_ call: CAPPluginCall) {
        guard let content = call.getString("content"),
              let backgroundColor = call.getString("backgroundColor"),
              let color = call.getString("color"),
              let order = call.getInt("order"),
              let deckIdString = call.getString("deckId"),
              let deckId = UUID(uuidString: deckIdString),
              let context = container?.mainContext else {
            call.reject("Missing card parameters")
            return
        }
        
        do {
            let deckDescriptor = FetchDescriptor<Deck>(predicate: #Predicate<Deck> { deck in deck.id == deckId})
            guard let deck = try context.fetch(deckDescriptor).first else {
                call.reject("Deck not found")
                return
            }
            
            let newCard = Card(content: content, backgroundColor: backgroundColor, color: color, order: order, deck: deck)
            context.insert(newCard)
            try context.save()
            
            call.resolve([
                "id": newCard.id.uuidString,
                "content": newCard.content,
                "backgroundColor": newCard.backgroundColor,
                "color": newCard.color,
                "order": newCard.order,
                "deckId": deck.id.uuidString
            ])
        } catch {
            call.reject("Failed to create card: \(error.localizedDescription)")
        }
    }
    
    @MainActor
    @objc func getCard(_ call: CAPPluginCall) {
        guard let idString = call.getString("id"),
              let id = UUID(uuidString: idString),
              let context = container?.mainContext else {
            call.reject("Invalid ID or context not available")
            return
        }
            
        do {
            let descriptor = FetchDescriptor<Card>(predicate: #Predicate<Card> { card in card.id == id})
            
            guard let card = try context.fetch(descriptor).first else {
                call.reject("Card not found")
                return
            }
            
            call.resolve([
                "id": card.id.uuidString,
                "content": card.content,
                "backgroundColor": card.backgroundColor,
                "color": card.color,
                "order": card.order,
                "deckId": card.deck.id.uuidString
            ])
        } catch {
            call.reject("Failed to fetch card: \(error.localizedDescription)")
        }
    }
    
    @MainActor
    @objc func getCardsByDeckId(_ call: CAPPluginCall) {
        guard let deckIdString = call.getString("deckId"),
              let deckId = UUID(uuidString: deckIdString),
              let context = container?.mainContext else {
            call.reject("Invalid deck ID or context not available")
            return
        }
            
        do {
            let descriptor = FetchDescriptor<Card>(
                predicate: #Predicate<Card> { card in card.deck.id == deckId },
                sortBy: [SortDescriptor(\.order)]
            )
            
            let cards = try context.fetch(descriptor)
            let cardsData = cards.map { card in
                [
                    "id": card.id.uuidString,
                    "content": card.content,
                    "backgroundColor": card.backgroundColor,
                    "color": card.color,
                    "order": card.order,
                    "deckId": card.deck.id.uuidString
                ]
            }
            
            call.resolve(["cards": cardsData])
        } catch {
            call.reject("Failed to fetch cards: \(error.localizedDescription)")
        }
    }
    
    @MainActor
    @objc func updateCard(_ call: CAPPluginCall) {
        guard let idString = call.getString("id"),
              let id = UUID(uuidString: idString),
              let context = container?.mainContext else {
            call.reject("Invalid ID or context not available")
            return
        }
            
        do {
            let descriptor = FetchDescriptor<Card>(predicate: #Predicate<Card> { card in card.id == id})
            
            guard let card = try context.fetch(descriptor).first else {
                call.reject("Card not found")
                return
            }
            
            if let content = call.getString("content") { card.content = content }
            if let backgroundColor = call.getString("backgroundColor") { card.backgroundColor = backgroundColor }
            if let color = call.getString("color") { card.color = color }
            if let order = call.getInt("order") { card.order = order }
            card.updatedAt = Date()
            
            try context.save()
            
            call.resolve([
                "id": card.id.uuidString,
                "content": card.content,
                "backgroundColor": card.backgroundColor,
                "color": card.color,
                "order": card.order,
                "deckId": card.deck.id.uuidString
            ])
        } catch {
            call.reject("Failed to update card: \(error.localizedDescription)")
        }
    }
    
    @MainActor
    @objc func deleteCard(_ call: CAPPluginCall) {
        guard let idString = call.getString("id"),
              let id = UUID(uuidString: idString),
              let context = container?.mainContext else {
            call.reject("Invalid ID or context not available")
            return
        }
            
        do {
            let descriptor = FetchDescriptor<Card>(predicate: #Predicate<Card> { card in card.id == id})
            
            guard let card = try context.fetch(descriptor).first else {
                call.reject("Card not found")
                return
            }
            
            context.delete(card)
            try context.save()
            call.resolve()
        } catch {
            call.reject("Failed to delete card: \(error.localizedDescription)")
        }
    }

    
}
