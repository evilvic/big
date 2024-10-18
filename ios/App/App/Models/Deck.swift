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
    var id: UUID = UUID()
    var name: String
    var detail: String?
    var backgroudColor: String
    var color: String
    var createdAt: Date = Date()
    var updatedAt: Date = Date()
    var order: Int
    
    @Relationship var cards: [Card] = []
    
    init(name: String, detail: String? = nil, backgroundColor: String, color: String, order: Int) {
        self.name = name
        self.detail = detail
        self.backgroudColor = backgroundColor
        self.color = color
        self.order = order
    }
}
