//
//  Card.swift
//  big
//
//  Created by Víctor Peña Romero on 18/10/24.
//

import Foundation
import SwiftData

@Model
final class Card {
    @Attribute(.unique) var id: UUID
    var content: String
    var backgroundColor: String
    var color: String
    var createdAt: Date
    var updatedAt: Date
    var order: Int
    
    @Relationship(inverse: \Deck.cards) var deck: Deck
    
    init(content: String, backgroundColor: String, color: String, order: Int, deck: Deck) {
        self.id = UUID()
        self.content = content
        self.backgroundColor = backgroundColor
        self.color = color
        self.order = order
        self.deck = deck
        self.createdAt = Date()
        self.updatedAt = Date()
    }
}
