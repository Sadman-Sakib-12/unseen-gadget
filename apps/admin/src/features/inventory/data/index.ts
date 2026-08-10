import inventoryJson from "./inventory.json";
import stockMovementsJson from "./stock-movements.json";

import type { InventoryItem, StockMovement } from "../types";

export const inventoryItems = inventoryJson as InventoryItem[];
export const stockMovements = stockMovementsJson as StockMovement[];
