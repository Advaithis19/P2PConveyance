import { orderStatusChanged as orderStatusChangedEvent } from "../generated/P2PConveyance/P2PConveyance"
import { orderStatusChanged } from "../generated/schema"

export function handleorderStatusChanged(event: orderStatusChangedEvent): void {
  let entity = new orderStatusChanged(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.id = event.params.id
  entity.restaurantName = event.params.restaurantName
  entity.customerName = event.params.customerName
  entity.deliveryAgentName = event.params.deliveryAgentName
  entity.hasBeenDelivered = event.params.hasBeenDelivered
  entity.save()
}
