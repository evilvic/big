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
    var id: UUID = UUID()
    var content: String
    var backgroundColor: String
    var color: String
    var createdAt: Date = Date()
    var updatedAt: Date = Date()
    var order: Int
    
    @Relationship var deck: Deck
    
    init(content: String, backgroundColor: String, color: String, order: Int, deck: Deck) {
        self.content = content
        self.backgroundColor = backgroundColor
        self.color = color
        self.order = order
        self.deck = deck
    }
}
