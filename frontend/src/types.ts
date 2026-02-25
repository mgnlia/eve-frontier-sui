export interface Asset {
  objectId: string; type: string; name: string; description: string
  imageUrl: string; version: string; digest: string; category: string
}
export interface FleetSummary { total_assets: number; ships: number; modules: number; resources: number; other: number }
export interface CategoryBreakdown { category: string; count: number }
export interface AssetTypeBreakdown { type: string; count: number }
export interface FleetData {
  wallet: string; sui_balance: number; fleet_summary: FleetSummary
  category_breakdown: CategoryBreakdown[]; top_asset_types: AssetTypeBreakdown[]
  ships: Asset[]; modules: Asset[]; resources: Asset[]; other: Asset[]
}
export interface Transaction { digest: string; timestamp_ms: string | null; status: string; gas_cost_mist: number; gas_cost_sui: number }
export interface TransactionResponse { wallet: string; transactions: Transaction[]; total: number }
export interface KillmailEntry { id?: string; killmailId?: number; timestamp?: string; victimName?: string; shipName?: string; totalValue?: number; solarSystemName?: string }
export interface TypeEntry { typeId?: number; name?: string; groupId?: number; volume?: number }
export const API_BASE = process.env.REACT_APP_API_BASE ?? ''
