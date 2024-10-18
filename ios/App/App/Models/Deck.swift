//
//  Deck.swift
//  big
//
//  Created by Víctor Peña Romero on 18/10/24.
//

import Foundation
import SwiftData

@Model
final class Deck {
    @Attribute(.unique) var id: UUID
    var name: String
    var detail: String?
    var backgroundColor: String
    var color: String
    var createdAt: Date
    var updatedAt: Date
    var order: Int
    
    @Relationship(deleteRule: .cascade) var cards: [Card] = []
    
    init(name: String, detail: String? = nil, backgroundColor: String, color: String, order: Int) {
        self.id = UUID()
        self.name = name
        self.detail = detail
        self.backgroundColor = backgroundColor
        self.color = color
        self.order = order
        self.createdAt = Date()
        self.updatedAt = Date()
    }
}
